<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template name="sidebar-entries">
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

	<legend>Folders</legend>
	<div class="list-wrapper" data-click="select-folder">
		<xsl:for-each select="./*">
			<div class="entry">
				<i class="icon-blank"></i>
				<i>
					<xsl:attribute name="class">icon-<xsl:value-of select="@icon"/></xsl:attribute>
				</i>
				<span class="name"><xsl:value-of select="@name"/></span>
				<xsl:if test="@unread">
					<span class="unread"><xsl:value-of select="@unread"/></span>
				</xsl:if>
			</div>
		</xsl:for-each>
	</div>
</xsl:template>


<xsl:template name="list-entries">
	<xsl:for-each select="./*">
		<xsl:sort order="descending" select="mail/date/@value"/>
		<xsl:call-template name="list-entry"/>
	</xsl:for-each>
</xsl:template>


<xsl:template name="list-entry">
	<div>
		<xsl:attribute name="class">
			entry
			<xsl:if test="@unread"> unread</xsl:if>
			<xsl:if test="@replied"> replied</xsl:if>
			<xsl:if test="@forwarded"> forwarded</xsl:if>
		</xsl:attribute>
		<div class="row">
			<span class="from"><xsl:value-of select="mail/from/@name"/></span>
			<xsl:if test="count(mail/attachment) &gt; 0">
				<i class="icon-attachment"></i>
			</xsl:if>
			<xsl:if test="mail/flag">
				<i class="icon-flag-red"></i>
			</xsl:if>
			<span class="date"><xsl:value-of select="mail/date/@date"/></span>
		</div>
		<div class="row">
			<span class="subject"><xsl:value-of select="mail/subject/text()"/></span>
			<xsl:if test="count(mail) &gt; 1">
				<span class="replies"><xsl:value-of select="count(mail)"/></span>
			</xsl:if>
		</div>
	</div>
</xsl:template>


<xsl:template name="content-entries">
	<div class="wrapper">
		<div class="thread-subject">
			<h2><xsl:value-of select="mail/subject/text()"/></h2>
			<i class="icon-thick-messages" data-click="toggle-message-view"></i>
		</div>

		<xsl:for-each select="./mail">
			<div class="entry">
				<xsl:if test="count(attachment) &gt; 0">
					<xsl:attribute name="data-attachment"><xsl:value-of select="count(attachment)"/></xsl:attribute>
				</xsl:if>
				<div class="head">
					<span class="avatar"></span>
					<div class="row">
						<span class="field-name">From</span>
						<span class="field-value from-name"><xsl:value-of select="from/@name"/></span>
						<span class="date"><xsl:value-of select="date/@value"/></span>
					</div>
					<div class="row">
						<span class="field-name">To</span>
						<span class="field-value from-name"><xsl:value-of select="to/@name"/></span>
					</div>
				</div>
				<div class="body">
					<xsl:value-of select="message/text()" disable-output-escaping="yes"/>
				</div>

				<xsl:if test="count(attachment) &gt; 0">
					<div class="foot">
						<xsl:for-each select="attachment">
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
		</xsl:for-each>

	</div>
</xsl:template>

</xsl:stylesheet>