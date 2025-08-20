<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template name="sidebar-entries">
	<!--
	<legend>Accounts</legend>
	<div class="list-wrapper" data-click="select-account">
		<xsl:for-each select="../Mailboxes/*">
			<div class="entry">
				<i class="icon-blank"></i>
				<i class="icon-cloud"></i>
				<span class="name"><xsl:value-of select="@name"/></span>
			</div>
		</xsl:for-each>
	</div>
	-->

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
			<xsl:if test="@replied or position() = 3"> replied</xsl:if>
			<xsl:if test="@forwarded or position() = 4"> forwarded</xsl:if>
		</xsl:attribute>
		<div class="row">
			<span class="from recient">
				<xsl:attribute name="data-mail"><xsl:value-of select="from/i/@mail"/></xsl:attribute>
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
			<xsl:if test="count(mail) &gt; 1">
				<span class="replies"><xsl:value-of select="count(mail)"/></span>
			</xsl:if>
		</div>
	</div>
</xsl:template>


<xsl:template name="content-entries">
	<div class="wrapper slim-messages">
		<div class="thread-subject">
			<h2><xsl:value-of select="subject/text()"/></h2>
			<i class="icon-thick-messages" data-click="toggle-message-view"></i>
		</div>

		<xsl:for-each select="./thread/mail">
			<xsl:call-template name="mail-entry"/>
		</xsl:for-each>

		<xsl:if test="not(./thread/mail)">
			<xsl:call-template name="mail-entry"/>
		</xsl:if>
	</div>
</xsl:template>


<xsl:template name="reply-to-mail">
	<br/><br/>
	<div class="quote_container block-collapsed" data-click="expand-container">
		<div>Den tis 19 aug. 2025 kl 09:10 skrev 
			<xsl:value-of select="from/i/@name"/> 
			&lt;<a>
				<xsl:attribute name="href">mailto:<xsl:value-of select="from/i/@mail"/></xsl:attribute>
				<xsl:value-of select="from/i/@mail"/>
			</a>&gt;:</div>
		<blockquote><xsl:value-of select="html/text()" disable-output-escaping="yes"/></blockquote>
	</div>
</xsl:template>


<xsl:template name="mail-entry">
	<div class="mail-entry">
		<xsl:if test="position() = 1 or name(..) != 'thread'">
			<xsl:attribute name="class">mail-entry active expanded</xsl:attribute>
		</xsl:if>
		<xsl:attribute name="data-id"><xsl:value-of select="@id"/></xsl:attribute>
		<xsl:attribute name="data-messageId"><xsl:value-of select="tags/*[@id='messageId']/@value"/></xsl:attribute>
		<xsl:if test="count(attachment) &gt; 0">
			<xsl:attribute name="data-attachment"><xsl:value-of select="count(attachment)"/></xsl:attribute>
		</xsl:if>
		<div class="head">
			<span class="avatar"></span>
			<div class="row">
				<span class="field-name">From</span>
				<span class="field-value from-name recient">
					<xsl:attribute name="data-mail"><xsl:value-of select="from/i/@mail"/></xsl:attribute>
					<xsl:value-of select="from/i/@name"/>
				</span>
				<span class="date"><xsl:value-of select="date/@date"/></span>
				<span class="time"><xsl:value-of select="date/@time"/></span>
			</div>
			<div class="row">
				<span class="field-name">To</span>
				<xsl:for-each select="to/i">
					<span class="field-value to-name recient">
						<xsl:attribute name="data-mail"><xsl:value-of select="@mail"/></xsl:attribute>
						<xsl:if test="@name = ''">
							<xsl:attribute name="class">field-value to-name no-name</xsl:attribute>
						</xsl:if>
						<xsl:value-of select="@name"/>
					</span>
				</xsl:for-each>
			</div>
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
								<span class="attendee"><xsl:value-of select="@mail"/></span>
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

		<div class="body">
			<xsl:value-of select="html/text()" disable-output-escaping="yes"/>
		</div>

		<xsl:if test="count(attachments/*) &gt; 0">
			<div class="foot">
				<xsl:for-each select="attachments/*">
					<span class="file-attachment">
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