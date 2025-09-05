<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template name="blank-view">
	<div class="blank-view" data-area="blankView">
		<h2>Welcome to Inbox.</h2>

		<div class="block-buttons">
			<div class="btn disabled_" data-click="new-mail">
				<i class="icon-new-mail"></i>
				New
			</div>

			<div class="btn" data-click="new-mail">
				<i class="icon-send-receive"></i>
				Sample Data
			</div>
			
			<div class="btn" data-click="open-filesystem">
				<i class="icon-folder-open"></i>
				Attachments folder
			</div>

			<!-- <div class="btn disabled_" data-click="from-clipboard">
				<i class="icon-clipboard"></i>
				From clipboard
			</div> -->
		</div>

		<div class="sample-demo-view">
			<i class="icon-warning"></i>
			Since this is the guest account, the privilege to send or receive e-mails has been disabled.
			You are welcome to test this application with <span data-click="init-demo-data">demo data</span> - 
			or <span data-click="register-account">register an account</span> to test full functionality.
		</div>

		<!-- <xsl:if test="//Settings/User/@account-type = 1">Free</xsl:if> -->

		<!-- <div class="block-samples" data-click="select-sample">
			<h3>Example</h3>
			<xsl:call-template name="sample-list" />
		</div>

		<xsl:if test="count(./Recents/*) &gt; 0">
			<div class="block-recent" data-click="select-recent-file">
				<h3>Recent</h3>
				<xsl:call-template name="recent-list" />
			</div>
		</xsl:if> -->
	</div>
</xsl:template>


<xsl:template name="sidebar-entries">
	<legend>Folders</legend>
	<div class="list-wrapper">
		<xsl:for-each select="./*">
			<div class="folder-entry">
				<xsl:attribute name="data-fId"><xsl:value-of select="@id"/></xsl:attribute>
				<i class="icon-blank"></i>
				<i><xsl:attribute name="class">icon-<xsl:value-of select="@icon"/></xsl:attribute></i>
				<span class="name"><xsl:value-of select="@name"/></span>
				<xsl:if test="@unread &gt; 0">
					<span class="unread"><xsl:value-of select="@unread"/></span>
				</xsl:if>
			</div>
		</xsl:for-each>
	</div>
</xsl:template>


<xsl:template name="list-entries">
	<xsl:for-each select="./*">
		<xsl:sort order="descending" select="@mStamp"/>
		<xsl:call-template name="list-entry"/>
	</xsl:for-each>
</xsl:template>


<xsl:template name="list-entry">
	<div data-ondrag="check-mail-drag">
		<xsl:attribute name="data-id"><xsl:value-of select="@id"/></xsl:attribute>
		<xsl:attribute name="class">
			list-entry
			<xsl:if test="@is_read = '0'"> unread</xsl:if>
			<xsl:if test="tags/i[@id = 'isReplied' and @value = '1']"> replied</xsl:if>
			<xsl:if test="tags/i[@id = 'isForward' and @value = '1']"> forward</xsl:if>
		</xsl:attribute>
		<div class="row">
			<span class="from recipient">
				<xsl:attribute name="data-address"><xsl:value-of select="from/i/@address"/></xsl:attribute>
				<xsl:value-of select="from/i/@name"/>
			</span>
			<xsl:if test="tags/i[@id = 'priority' and @value = '1']">
				<i class="icon-flag-red"></i>
			</xsl:if>
			<span class="date"><xsl:value-of select="substring-before(@date, ' ')"/></span>
		</div>
		<div class="row">
			<span class="subject"><xsl:value-of select="subject/text()"/></span>
			<xsl:if test="count(attachments/*) &gt; 0">
				<i class="icon-attachment"></i>
			</xsl:if>
			<xsl:if test="@thread">
				<span class="replies"><xsl:value-of select="@thread"/></span>
			</xsl:if>
		</div>
	</div>
</xsl:template>


<xsl:template name="content-entries">
	<div class="wrapper">
		<xsl:attribute name="data-lanes"><xsl:value-of select="./thread/@lanes"/></xsl:attribute>

		<div class="thread-subject">
			<h2><xsl:value-of select="subject/text()"/></h2>
			<i class="icon-slim-messages" data-click="toggle-message-view"></i>
		</div>

		<xsl:for-each select="./thread/mail">
			<xsl:sort order="descending" select="date/@value"/>
			<xsl:call-template name="mail-entry"/>
		</xsl:for-each>
	</div>
</xsl:template>


<xsl:template name="mail-entry">
	<div class="mail-entry">
		<xsl:attribute name="class">mail-entry 
			<xsl:value-of select="@class"/> 
			<xsl:if test="tags/*[@id='deleted'][@value='symbolic']"> deleted</xsl:if>
		</xsl:attribute>
		<xsl:attribute name="data-id"><xsl:value-of select="@id"/></xsl:attribute>
		<xsl:attribute name="data-messageId"><xsl:value-of select="tags/*[@id='messageId']/@value"/></xsl:attribute>
		<xsl:if test="count(attachments/i) &gt; 0">
			<xsl:attribute name="data-attachments"><xsl:value-of select="count(attachments/i)"/></xsl:attribute>
		</xsl:if>
		
		<div class="graph">
			<i class="l1"></i>
			<i class="l2"></i>
			<i class="l3"></i>
			<i class="l4"></i>
		</div>
		
		<span data-menu="mail-actions"><i class="icon-more-menu"></i></span>

		<div class="head">
			<xsl:choose>
				<xsl:when test="tags/*[@id='deleted'][@value='symbolic']">
					<span>Deleted</span>
					<span class="btn-undo" data-click="undo-deleted-message">Undo</span>
				</xsl:when>
				<xsl:otherwise>
					<span class="avatar"></span>
					<div class="row">
						<span class="field-name">From</span>
						<span class="field-value from-name recipient">
							<xsl:attribute name="data-address"><xsl:value-of select="from/i/@address"/></xsl:attribute>
							<xsl:value-of select="from/i/@name"/>
						</span>
						<span class="date"><xsl:value-of select="date/@date"/></span>
						<span class="time"><xsl:value-of select="date/@time"/></span>
					</div>
					<div class="row">
						<span class="field-name">To</span>
						<xsl:for-each select="to/i">
							<xsl:if test="position() &gt; 1">, </xsl:if>
							<span class="field-value to-name recipient">
								<xsl:attribute name="data-address"><xsl:value-of select="@address"/></xsl:attribute>
								<xsl:if test="@name = ''">
									<xsl:attribute name="class">field-value to-name no-name</xsl:attribute>
								</xsl:if>
								<xsl:value-of select="@name"/>
							</span>
						</xsl:for-each>
					</div>
					<div class="excerpt">
						<xsl:value-of select="excerpt/text()" disable-output-escaping="yes"/>
					</div>
				</xsl:otherwise>
			</xsl:choose>
		</div>

		<xsl:for-each select="attachments/*[@kind = 'ics']">
			<div class="ics-card">
				<div class="ics-date">
					<div class="ics-cal-date">
						<span class="month"><xsl:value-of select="date/@month"/></span>
						<span class="date"><xsl:value-of select="date/@date"/></span>
						<span class="weekday"><xsl:value-of select="date/@weekday"/></span>
					</div>
				</div>
				<div class="ics-info">
					<h3><xsl:value-of select="title"/></h3>
					<div class="row">
						<span class="icon"><i class="icon-calendar"></i></span>
						<span class="name">När</span>
						<span class="value"><xsl:value-of select="date"/></span>
					</div>
					<div class="row">
						<span class="icon"><i class="icon-location"></i></span>
						<span class="name">Var</span>
						<span class="value"><xsl:value-of select="location"/></span>
					</div>
					<div class="row">
						<span class="icon"><i class="icon-user"></i></span>
						<span class="name">Vem</span>
						<span class="value">
							<xsl:for-each select="attendees/*">
								<xsl:if test="position() &gt; 1">, </xsl:if>
								<span class="attendee recipient">
									<xsl:attribute name="data-address"><xsl:value-of select="@address"/></xsl:attribute>
									<xsl:value-of select="@name"/>
								</span>
							</xsl:for-each>
						</span>
					</div>
					<div class="buttons">
						<button disabled="disabled">Yes</button>
						<button disabled="disabled">Maybe</button>
						<button disabled="disabled">No</button>
						<span></span>
						<button data-click="add-to-calendar">
							<xsl:attribute name="data-path"><xsl:value-of select="@path"/></xsl:attribute>
							Add to Calendar
						</button>
					</div>
				</div>
			</div>
		</xsl:for-each>

		<div class="body" contenteditable="false">
			<xsl:value-of select="html/text()" disable-output-escaping="yes"/>
		</div>

		<xsl:if test="count(attachments/*) &gt; 0">
			<div class="foot">
				<xsl:for-each select="attachments/*">
					<span class="file-attachment" data-click="open-attached-folder">
						<xsl:attribute name="data-path"><xsl:value-of select="@path"/></xsl:attribute>
						<i>
							<xsl:attribute name="style">background-image: url(/app/icons/file-<xsl:value-of select="@kind"/>.png);</xsl:attribute>
						</i>
						<span><xsl:value-of select="@name"/></span>
					</span>
				</xsl:for-each>
			</div>
		</xsl:if>
	</div>
</xsl:template>

</xsl:stylesheet>