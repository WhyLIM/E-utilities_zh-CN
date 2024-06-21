import{_ as s}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as n,o as e,d as a}from"./app-D-JbdY3s.js";const i={},l=a(`<h1 id="sample-applications-of-the-e-utilities" tabindex="-1"><a class="header-anchor" href="#sample-applications-of-the-e-utilities"><span>Sample Applications of the E-utilities</span></a></h1><blockquote><p>Eric Sayers, PhD.</p><p><a href="https://www.ncbi.nlm.nih.gov/books/NBK25498/#__NBK25498_ai__" target="_blank" rel="noopener noreferrer">Author Information and Affiliations</a></p><p><strong>Authors</strong></p><p>Eric Sayers, PhD<img src="https://www.ncbi.nlm.nih.gov/corehtml/pmc/pmcgifs/corrauth.gif" alt="corresponding author" loading="lazy">1.</p><p><strong>Affilitions</strong></p><p>1 NCBI</p><p>Email: <a href="mailto:dev@null" target="_blank" rel="noopener noreferrer">vog.hin.mln.ibcn@sreyas</a></p><p><img src="https://www.ncbi.nlm.nih.gov/corehtml/pmc/pmcgifs/corrauth.gif" alt="corresponding author" loading="lazy">Corresponding author.</p><p>Created: April 24, 2009; Last Update: November 1, 2017.</p><p><em>Estimated reading time: 9 minutes</em></p></blockquote><h2 id="introduction" tabindex="-1"><a class="header-anchor" href="#introduction"><span>Introduction</span></a></h2><p>This chapter presents several examples of how the E-utilities can be used to build useful applications. These examples use Perl to create the E-utility pipelines, and assume that the LWP::Simple module is installed. This module includes the <em>get</em> function that supports HTTP GET requests. One example (Application 4) uses an HTTP POST request, and requires the LWP::UserAgent module. In Perl, scalar variable names are preceded by a &quot;$&quot; symbol, and array names are preceded by a &quot;@&quot;. In several instances, results will be stored in such variables for use in subsequent E-utility calls. The code examples here are working programs that can be copied to a text editor and executed directly. Equivalent HTTP requests can be constructed in many modern programming languages; all that is required is the ability to create and post an HTTP request.</p><h2 id="basic-pipelines" tabindex="-1"><a class="header-anchor" href="#basic-pipelines"><span>Basic Pipelines</span></a></h2><p>All E-utility applications consist of a series of calls that we will refer to as a pipeline. The simplest E-utility pipelines consist of two calls, and any arbitrary pipeline can be assembled from these basic building blocks. Many of these pipelines conclude with either ESummary (to retrieve DocSums) or EFetch (to retrieve full records). The comments indicate those portions of the code that are required for either call.</p><h2 id="esearch-–-esummary-efetch" tabindex="-1"><a class="header-anchor" href="#esearch-–-esummary-efetch"><span>ESearch – ESummary/EFetch</span></a></h2><p><strong>Input:</strong> Entrez text query</p><p><strong>ESummary Output:</strong> XML Document Summaries</p><p><strong>EFetch Output:</strong> Formatted data records (e.g. abstracts, FASTA)</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>use LWP::Simple;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Download PubMed records that are indexed in MeSH for both asthma and </span></span>
<span class="line"><span># leukotrienes and were also published in 2009.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>$db = &#39;pubmed&#39;;</span></span>
<span class="line"><span>$query = &#39;asthma[mesh]+AND+leukotrienes[mesh]+AND+2009[pdat]&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#assemble the esearch URL</span></span>
<span class="line"><span>$base = &#39;https://eutils.ncbi.nlm.nih.gov/entrez/eutils/&#39;;</span></span>
<span class="line"><span>$url = $base . &quot;esearch.fcgi?db=$db&amp;term=$query&amp;usehistory=y&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#post the esearch URL</span></span>
<span class="line"><span>$output = get($url);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#parse WebEnv and QueryKey</span></span>
<span class="line"><span>$web = $1 if ($output =~ /&lt;WebEnv&gt;(\\S+)&lt;\\/WebEnv&gt;/);</span></span>
<span class="line"><span>$key = $1 if ($output =~ /&lt;QueryKey&gt;(\\d+)&lt;\\/QueryKey&gt;/);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### include this code for ESearch-ESummary</span></span>
<span class="line"><span>#assemble the esummary URL</span></span>
<span class="line"><span>$url = $base . &quot;esummary.fcgi?db=$db&amp;query_key=$key&amp;WebEnv=$web&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#post the esummary URL</span></span>
<span class="line"><span>$docsums = get($url);</span></span>
<span class="line"><span>print &quot;$docsums&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### include this code for ESearch-EFetch</span></span>
<span class="line"><span>#assemble the efetch URL</span></span>
<span class="line"><span>$url = $base . &quot;efetch.fcgi?db=$db&amp;query_key=$key&amp;WebEnv=$web&quot;;</span></span>
<span class="line"><span>$url .= &quot;&amp;rettype=abstract&amp;retmode=text&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#post the efetch URL</span></span>
<span class="line"><span>$data = get($url);</span></span>
<span class="line"><span>print &quot;$data&quot;;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="epost-–-esummary-efetch" tabindex="-1"><a class="header-anchor" href="#epost-–-esummary-efetch"><span>EPost – ESummary/EFetch</span></a></h2><p><strong>Input:</strong> List of Entrez UIDs (integer identifiers, e.g. PMID, GI, Gene ID)</p><p><strong>ESummary Output:</strong> XML Document Summaries</p><p><strong>EFetch Output:</strong> Formatted data records (e.g. abstracts, FASTA)</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>use LWP::Simple;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Download protein records corresponding to a list of GI numbers.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>$db = &#39;protein&#39;;</span></span>
<span class="line"><span>$id_list = &#39;194680922,50978626,28558982,9507199,6678417&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#assemble the epost URL</span></span>
<span class="line"><span>$base = &#39;https://eutils.ncbi.nlm.nih.gov/entrez/eutils/&#39;;</span></span>
<span class="line"><span>$url = $base . &quot;epost.fcgi?db=$db&amp;id=$id_list&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#post the epost URL</span></span>
<span class="line"><span>$output = get($url);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#parse WebEnv and QueryKey</span></span>
<span class="line"><span>$web = $1 if ($output =~ /&lt;WebEnv&gt;(\\S+)&lt;\\/WebEnv&gt;/);</span></span>
<span class="line"><span>$key = $1 if ($output =~ /&lt;QueryKey&gt;(\\d+)&lt;\\/QueryKey&gt;/);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### include this code for EPost-ESummary</span></span>
<span class="line"><span>#assemble the esummary URL</span></span>
<span class="line"><span>$url = $base . &quot;esummary.fcgi?db=$db&amp;query_key=$key&amp;WebEnv=$web&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#post the esummary URL</span></span>
<span class="line"><span>$docsums = get($url);</span></span>
<span class="line"><span>print &quot;$docsums&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### include this code for EPost-EFetch</span></span>
<span class="line"><span>#assemble the efetch URL</span></span>
<span class="line"><span>$url = $base . &quot;efetch.fcgi?db=$db&amp;query_key=$key&amp;WebEnv=$web&quot;;</span></span>
<span class="line"><span>$url .= &quot;&amp;rettype=fasta&amp;retmode=text&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#post the efetch URL</span></span>
<span class="line"><span>$data = get($url);</span></span>
<span class="line"><span>print &quot;$data&quot;;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><em><strong>Note:*</strong> <em>To post a large number (more than a few hundred) UIDs in a single URL, please use the HTTP POST method for the EPost call (see</em> <a href="https://www.ncbi.nlm.nih.gov/books/NBK25498/#chapter3.Application_4_Finding_unique_se" target="_blank" rel="noopener noreferrer"><em>Application 4</em></a></em>).*</p><h2 id="elink-–-esummary-efetch" tabindex="-1"><a class="header-anchor" href="#elink-–-esummary-efetch"><span>ELink – ESummary/Efetch</span></a></h2><p><strong>Input:</strong> List of Entrez UIDs in database A (integer identifiers, e.g. PMID, GI, Gene ID)</p><p><strong>ESummary Output:</strong> Linked XML Document Summaries from database B</p><p><strong>EFetch Output:</strong> Formatted data records (e.g. abstracts, FASTA) from database B</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>use LWP::Simple;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Download gene records linked to a set of proteins corresponding to a list</span></span>
<span class="line"><span># of GI numbers.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>$db1 = &#39;protein&#39;;  # &amp;dbfrom</span></span>
<span class="line"><span>$db2 = &#39;gene&#39;;     # &amp;db</span></span>
<span class="line"><span>$linkname = &#39;protein_gene&#39;; # desired link &amp;linkname</span></span>
<span class="line"><span>#input UIDs in $db1 (protein GIs)</span></span>
<span class="line"><span>$id_list = &#39;194680922,50978626,28558982,9507199,6678417&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#assemble the elink URL</span></span>
<span class="line"><span>$base = &#39;https://eutils.ncbi.nlm.nih.gov/entrez/eutils/&#39;;</span></span>
<span class="line"><span>$url = $base . &quot;elink.fcgi?dbfrom=$db1&amp;db=$db2&amp;id=$id_list&quot;;</span></span>
<span class="line"><span>$url .= &quot;&amp;linkname=$linkname&amp;cmd=neighbor_history&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#post the elink URL</span></span>
<span class="line"><span>$output = get($url);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#parse WebEnv and QueryKey</span></span>
<span class="line"><span>$web = $1 if ($output =~ /&lt;WebEnv&gt;(\\S+)&lt;\\/WebEnv&gt;/);</span></span>
<span class="line"><span>$key = $1 if ($output =~ /&lt;QueryKey&gt;(\\d+)&lt;\\/QueryKey&gt;/);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### include this code for ELink-ESummary</span></span>
<span class="line"><span>#assemble the esummary URL</span></span>
<span class="line"><span>$url = $base . &quot;esummary.fcgi?db=$db&amp;query_key=$key&amp;WebEnv=$web&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#post the esummary URL</span></span>
<span class="line"><span>$docsums = get($url);</span></span>
<span class="line"><span>print &quot;$docsums&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### include this code for ELink-EFetch</span></span>
<span class="line"><span>#assemble the efetch URL</span></span>
<span class="line"><span>$url = $base . &quot;efetch.fcgi?db=$db2&amp;query_key=$key&amp;WebEnv=$web&quot;;</span></span>
<span class="line"><span>$url .= &quot;&amp;rettype=xml&amp;retmode=xml&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#post the efetch URL</span></span>
<span class="line"><span>$data = get($url);</span></span>
<span class="line"><span>print &quot;$data&quot;;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>*<strong>Notes:*</strong> <em>To submit a large number (more than a few hundred) UIDs to ELink in one URL, please use the HTTP POST method for the Elink call (see Application 4). The &amp;linkname parameter is used to force ELink to return only one set of links (one &amp;query_key) to simplify parsing. If more than one link is desired, the above code must be altered to parse the multiple &amp;query_key values from the ELink XML output. This code uses ELink in &quot;batch&quot; mode, in that only one set of gene IDs is returned and the one-to-one correspondence between protein GIs and gene IDs is lost. To preserve this one-to-one correspondence, please see</em> <a href="https://www.ncbi.nlm.nih.gov/books/NBK25498/#chapter3.Application_4_Finding_unique_se" target="_blank" rel="noopener noreferrer"><em>Application 4</em></a> <em>below.</em></p><h2 id="esearch-–-elink-–-esummary-efetch" tabindex="-1"><a class="header-anchor" href="#esearch-–-elink-–-esummary-efetch"><span>ESearch – ELink – ESummary/EFetch</span></a></h2><p><strong>Input:</strong> Entrez text query in database A</p><p><strong>ESummary Output:</strong> Linked XML Document Summaries from database B</p><p><strong>EFetch Output:</strong> Formatted data records (e.g. abstracts, FASTA) from database B</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>use LWP::Simple;</span></span>
<span class="line"><span># Download protein FASTA records linked to abstracts published </span></span>
<span class="line"><span># in 2009 that are indexed in MeSH for both asthma and </span></span>
<span class="line"><span># leukotrienes.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>$db1 = &#39;pubmed&#39;;</span></span>
<span class="line"><span>$db2 = &#39;protein&#39;;</span></span>
<span class="line"><span>$linkname = &#39;pubmed_protein&#39;;</span></span>
<span class="line"><span>$query = &#39;asthma[mesh]+AND+leukotrienes[mesh]+AND+2009[pdat]&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#assemble the esearch URL</span></span>
<span class="line"><span>$base = &#39;https://eutils.ncbi.nlm.nih.gov/entrez/eutils/&#39;;</span></span>
<span class="line"><span>$url = $base . &quot;esearch.fcgi?db=$db1&amp;term=$query&amp;usehistory=y&quot;;</span></span>
<span class="line"><span>#post the esearch URL</span></span>
<span class="line"><span>$output = get($url);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#parse WebEnv and QueryKey</span></span>
<span class="line"><span>$web1 = $1 if ($output =~ /&lt;WebEnv&gt;(\\S+)&lt;\\/WebEnv&gt;/);</span></span>
<span class="line"><span>$key1 = $1 if ($output =~ /&lt;QueryKey&gt;(\\d+)&lt;\\/QueryKey&gt;/);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#assemble the elink URL</span></span>
<span class="line"><span>$base = &#39;https://eutils.ncbi.nlm.nih.gov/entrez/eutils/&#39;;</span></span>
<span class="line"><span>$url = $base . &quot;elink.fcgi?dbfrom=$db1&amp;db=$db2&quot;;</span></span>
<span class="line"><span>$url .= &quot;&amp;query_key=$key1&amp;WebEnv=$web1&quot;;</span></span>
<span class="line"><span>$url .= &quot;&amp;linkname=$linkname&amp;cmd=neighbor_history&quot;;</span></span>
<span class="line"><span>print &quot;$url\\n&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#post the elink URL</span></span>
<span class="line"><span>$output = get($url);</span></span>
<span class="line"><span>print &quot;$output\\n&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#parse WebEnv and QueryKey</span></span>
<span class="line"><span>$web2 = $1 if ($output =~ /&lt;WebEnv&gt;(\\S+)&lt;\\/WebEnv&gt;/);</span></span>
<span class="line"><span>$key2 = $1 if ($output =~ /&lt;QueryKey&gt;(\\d+)&lt;\\/QueryKey&gt;/);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### include this code for ESearch-ELink-ESummary</span></span>
<span class="line"><span>#assemble the esummary URL</span></span>
<span class="line"><span>$url = $base . &quot;esummary.fcgi?db=$db2&amp;query_key=$key2&amp;WebEnv=$web2&quot;;</span></span>
<span class="line"><span>#post the esummary URL</span></span>
<span class="line"><span>$docsums = get($url);</span></span>
<span class="line"><span>print &quot;$docsums&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### include this code for ESearch-ELink-EFetch</span></span>
<span class="line"><span>#assemble the efetch URL</span></span>
<span class="line"><span>$url = $base . &quot;efetch.fcgi?db=$db2&amp;query_key=$key2&amp;WebEnv=$web2&quot;;</span></span>
<span class="line"><span>$url .= &quot;&amp;rettype=fasta&amp;retmode=text&quot;;</span></span>
<span class="line"><span>#post the efetch URL</span></span>
<span class="line"><span>$data = get($url);</span></span>
<span class="line"><span>print &quot;$data&quot;;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>*<strong>Notes:*</strong> <em>The &amp;linkname parameter is used to force ELink to return only one set of links (one &amp;query_key) to simplify parsing. If more than one link is desired, the above code must be altered to parse the multiple &amp;query_key values from the ELink XML output. This code uses ELink in &quot;batch&quot; mode, in that only one set of PubMed IDs is returned and the one-to-one correspondence between PubMed IDs and their related PubMed IDs is lost. To preserve this one-to-one correspondence, please see</em> <a href="https://www.ncbi.nlm.nih.gov/books/NBK25498/#chapter3.Application_4_Finding_unique_se" target="_blank" rel="noopener noreferrer"><em>Application 4</em></a> <em>below.</em></p><h2 id="epost-–-elink-–-esummary-efetch" tabindex="-1"><a class="header-anchor" href="#epost-–-elink-–-esummary-efetch"><span>EPost – ELink – ESummary/EFetch</span></a></h2><p><strong>Input:</strong> List of Entrez UIDs (integer identifiers, e.g. PMID, GI, Gene ID) in database A</p><p><strong>ESummary Output:</strong> Linked XML Document Summaries from database B</p><p><strong>EFetch Output:</strong> Formatted data records (e.g. abstracts, FASTA) from database B</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>use LWP::Simple;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Downloads gene records linked to a set of proteins corresponding</span></span>
<span class="line"><span># to a list of protein GI numbers.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>$db1 = &#39;protein&#39;;  # &amp;dbfrom</span></span>
<span class="line"><span>$db2 = &#39;gene&#39;;     # &amp;db</span></span>
<span class="line"><span>$linkname = &#39;protein_gene&#39;;</span></span>
<span class="line"><span>#input UIDs in $db1 (protein GIs)</span></span>
<span class="line"><span>$id_list = &#39;194680922,50978626,28558982,9507199,6678417&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#assemble the epost URL</span></span>
<span class="line"><span>$base = &#39;https://eutils.ncbi.nlm.nih.gov/entrez/eutils/&#39;;</span></span>
<span class="line"><span>$url = $base . &quot;epost.fcgi?db=$db1&amp;id=$id_list&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#post the epost URL</span></span>
<span class="line"><span>$output = get($url);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#parse WebEnv and QueryKey</span></span>
<span class="line"><span>$web1 = $1 if ($output =~ /&lt;WebEnv&gt;(\\S+)&lt;\\/WebEnv&gt;/);</span></span>
<span class="line"><span>$key1 = $1 if ($output =~ /&lt;QueryKey&gt;(\\d+)&lt;\\/QueryKey&gt;/);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#assemble the elink URL</span></span>
<span class="line"><span>$base = &#39;https://eutils.ncbi.nlm.nih.gov/entrez/eutils/&#39;;</span></span>
<span class="line"><span>$url = $base . &quot;elink.fcgi?dbfrom=$db1&amp;db=$db2&amp;query_key=$key1&quot;;</span></span>
<span class="line"><span>$url .= &quot;&amp;WebEnv=$web1&amp;linkname=$linkname&amp;cmd=neighbor_history&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#post the elink URL</span></span>
<span class="line"><span>$output = get($url);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#parse WebEnv and QueryKey</span></span>
<span class="line"><span>$web2 = $1 if ($output =~ /&lt;WebEnv&gt;(\\S+)&lt;\\/WebEnv&gt;/);</span></span>
<span class="line"><span>$key2 = $1 if ($output =~ /&lt;QueryKey&gt;(\\d+)&lt;\\/QueryKey&gt;/);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### include this code for ESearch-ELink-ESummary</span></span>
<span class="line"><span>#assemble the esummary URL</span></span>
<span class="line"><span>$url = $base . &quot;esummary.fcgi?db=$db2&amp;query_key=$key2&amp;WebEnv=$web2&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#post the esummary URL</span></span>
<span class="line"><span>$docsums = get($url);</span></span>
<span class="line"><span>print &quot;$docsums&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### include this code for ESearch-ELink-EFetch</span></span>
<span class="line"><span>#assemble the efetch URL</span></span>
<span class="line"><span>$url = $base . &quot;efetch.fcgi?db=$db2&amp;query_key=$key2&amp;WebEnv=$web2&quot;;</span></span>
<span class="line"><span>$url .= &quot;&amp;rettype=xml&amp;retmode=xml&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#post the efetch URL</span></span>
<span class="line"><span>$data = get($url);</span></span>
<span class="line"><span>print &quot;$data&quot;;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>*<strong>Notes:*</strong> <em>To post a large number (more than a few hundred) UIDs in a single URL, please use the HTTP POST method for the EPost call (see Application 4 below). The &amp;linkname parameter is used to force ELink to return only one set of links (one &amp;query_key) to simplify parsing. If more than one link is desired, the above code must be altered to parse the multiple &amp;query_key values from the ELink XML output. This code uses ELink in &quot;batch&quot; mode, in that only one set of gene IDs is returned and the one-to-one correspondence between protein GIs and Gene IDs is lost. To preserve this one-to-one correspondence, please see</em> <a href="https://www.ncbi.nlm.nih.gov/books/NBK25498/#chapter3.Application_4_Finding_unique_se" target="_blank" rel="noopener noreferrer"><em>Application 4</em></a> <em>below.</em></p><h2 id="epost-–-esearch" tabindex="-1"><a class="header-anchor" href="#epost-–-esearch"><span>EPost – ESearch</span></a></h2><p><strong>Input:</strong> List of Entrez UIDs (integer identifiers, e.g. PMID, GI, Gene ID)</p><p><strong>Output:</strong> History set consisting of the subset of posted UIDs that match an Entrez text query</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>use LWP::Simple;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Given an input set of protein GI numbers, this script creates </span></span>
<span class="line"><span># a history set containing the members of the input set that </span></span>
<span class="line"><span># correspond to human proteins. </span></span>
<span class="line"><span>#(Which of these proteins are from human?)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>$db = &#39;protein&#39;;</span></span>
<span class="line"><span>$query = &#39;human[orgn]&#39;;</span></span>
<span class="line"><span>$id_list = &#39;194680922,50978626,28558982,9507199,6678417&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#assemble the epost URL</span></span>
<span class="line"><span>$base = &#39;https://eutils.ncbi.nlm.nih.gov/entrez/eutils/&#39;;</span></span>
<span class="line"><span>$url = $base . &quot;epost.fcgi?db=$db&amp;id=$id_list&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#post the epost URL</span></span>
<span class="line"><span>$output = get($url);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#parse WebEnv and QueryKey</span></span>
<span class="line"><span>$web = $1 if ($output =~ /&lt;WebEnv&gt;(\\S+)&lt;\\/WebEnv&gt;/);</span></span>
<span class="line"><span>$key = $1 if ($output =~ /&lt;QueryKey&gt;(\\d+)&lt;\\/QueryKey&gt;/);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#assemble the esearch URL</span></span>
<span class="line"><span>$term = &quot;%23$key+AND+$query&quot;;  </span></span>
<span class="line"><span># %23 places a &#39;#&#39; before the query key</span></span>
<span class="line"><span>$url = $base . &quot;esearch.fcgi?db=$db&amp;term=$term&quot;;</span></span>
<span class="line"><span>$url .= &quot;&amp;WebEnv=$web&amp;usehistory=y&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#post esearch URL</span></span>
<span class="line"><span>$limited = get($url);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>print &quot;$limited\\n&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Output remains on the history server (&amp;query_key, &amp;WebEnv)</span></span>
<span class="line"><span># Use ESummary or EFetch as above to retrieve them</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><em><strong>Note:*</strong> <em>To post a large number (more than a few hundred) UIDs in a single URL, please use the HTTP POST method for the EPost call (see</em> <a href="https://www.ncbi.nlm.nih.gov/books/NBK25498/#chapter3.Application_4_Finding_unique_se" target="_blank" rel="noopener noreferrer"><em>Application 4</em></a></em>).*</p><h2 id="elink-–-esearch" tabindex="-1"><a class="header-anchor" href="#elink-–-esearch"><span>ELink – ESearch</span></a></h2><p><strong>Input:</strong> List of Entrez UIDs (integer identifiers, e.g. PMID, GI, Gene ID) in database A</p><p><strong>Output:</strong> History set consisting of the subset of linked UIDs in database B that match an Entrez text query</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>use LWP::Simple;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Given an input set of protein GI numbers, this script creates a </span></span>
<span class="line"><span># history set containing the gene IDs linked to members of the input </span></span>
<span class="line"><span># set that also are on human chromosome X. </span></span>
<span class="line"><span>#(Which of the input proteins are encoded by a gene on human </span></span>
<span class="line"><span># chromosome X?)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>$db1 = &#39;protein&#39;;  # &amp;dbfrom</span></span>
<span class="line"><span>$db2 = &#39;gene&#39;;     # &amp;db</span></span>
<span class="line"><span>$linkname = &#39;protein_gene&#39;; # desired link &amp;linkname</span></span>
<span class="line"><span>$query = &#39;human[orgn]+AND+x[chr]&#39;;</span></span>
<span class="line"><span>#input UIDs in $db1 (protein GIs)</span></span>
<span class="line"><span>$id_list = &#39;148596974,42544182,187937179,4557377,6678417&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#assemble the elink URL</span></span>
<span class="line"><span>$base = &#39;https://eutils.ncbi.nlm.nih.gov/entrez/eutils/&#39;;</span></span>
<span class="line"><span>$url = $base . &quot;elink.fcgi?dbfrom=$db1&amp;db=$db2&amp;id=$id_list&quot;;</span></span>
<span class="line"><span>$url .= &quot;&amp;linkname=$linkname&amp;cmd=neighbor_history&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#post the elink URL</span></span>
<span class="line"><span>$output = get($url);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#parse WebEnv and QueryKey</span></span>
<span class="line"><span>$web = $1 if ($output =~ /&lt;WebEnv&gt;(\\S+)&lt;\\/WebEnv&gt;/);</span></span>
<span class="line"><span>$key = $1 if ($output =~ /&lt;QueryKey&gt;(\\d+)&lt;\\/QueryKey&gt;/);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#assemble the esearch URL</span></span>
<span class="line"><span>$term = &quot;%23$key+AND+$query&quot;;  # %23 places a &#39;#&#39; before the query key</span></span>
<span class="line"><span>$url = $base . &quot;esearch.fcgi?db=$db2&amp;term=$term&amp;WebEnv=$web&amp;usehistory=y&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#post esearch URL</span></span>
<span class="line"><span>$limited = get($url);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>print &quot;$limited\\n&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Output remains on the history server (&amp;query_key, &amp;WebEnv)</span></span>
<span class="line"><span># Use ESummary or EFetch as in previous examples to retrieve them</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><em><strong>Note:*</strong> <em>To submit a large number (more than a few hundred) UIDs to ELink in one URL, please use the HTTP POST method for the Elink call (see</em> <a href="https://www.ncbi.nlm.nih.gov/books/NBK25498/#chapter3.Application_4_Finding_unique_se" target="_blank" rel="noopener noreferrer"><em>Application 4</em></a></em>). The &amp;linkname parameter is used to force ELink to return only one set of links (one &amp;query_key) to simplify parsing. If more than one link is desired, the above code must be altered to parse the multiple &amp;query_key values from the ELink XML output. This code uses ELink in &quot;batch&quot; mode, in that only one set of gene IDs is returned and the one-to-one correspondence between protein GIs and Gene IDs is lost. To preserve this one-to-one correspondence, please see* <a href="https://www.ncbi.nlm.nih.gov/books/NBK25498/#chapter3.Application_4_Finding_unique_se" target="_blank" rel="noopener noreferrer"><em>Application 4</em></a> <em>below.</em></p><h2 id="application-1-converting-gi-numbers-to-accession-numbers" tabindex="-1"><a class="header-anchor" href="#application-1-converting-gi-numbers-to-accession-numbers"><span>Application 1: Converting GI numbers to accession numbers</span></a></h2><p><strong>Goal:</strong> Starting with a list of nucleotide GI numbers, prepare a set of corresponding accession numbers.</p><p><strong>Solution:</strong> Use EFetch with &amp;retttype=acc</p><p><strong>Input:</strong> $gi_list – comma-delimited list of GI numbers</p><p><strong>Output:</strong> List of accession numbers.</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>use LWP::Simple;</span></span>
<span class="line"><span>$gi_list = &#39;24475906,224465210,50978625,9507198&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#assemble the URL</span></span>
<span class="line"><span>$base = &#39;https://eutils.ncbi.nlm.nih.gov/entrez/eutils/&#39;;</span></span>
<span class="line"><span>$url = $base . &quot;efetch.fcgi?db=nucleotide&amp;id=$gi_list&amp;rettype=acc&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#post the URL</span></span>
<span class="line"><span>$output = get($url);</span></span>
<span class="line"><span>print &quot;$output&quot;;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>*<strong>Notes:*</strong> <em>The order of the accessions in the output will be the same order as the GI numbers in $gi_list.</em></p><h2 id="application-2-converting-accession-numbers-to-data" tabindex="-1"><a class="header-anchor" href="#application-2-converting-accession-numbers-to-data"><span>Application 2: Converting accession numbers to data</span></a></h2><p><strong>Goal:</strong> Starting with a list of protein accession numbers, return the sequences in FASTA format.</p><p><strong>Solution:</strong> Create a string consisting of items separated by &#39;OR&#39;, where each item is an accession number followed by &#39;[accn]&#39;.</p><p>Example: accn1[accn]+OR+accn2[accn]+OR+accn3[accn]+OR+…</p><p>Submit this string as a &amp;term in ESearch, then use EFetch to retrieve the FASTA data.</p><p><strong>Input:</strong> $acc_list – comma-delimited list of accessions</p><p><strong>Output:</strong> FASTA data</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>use LWP::Simple;</span></span>
<span class="line"><span>$acc_list = &#39;NM_009417,NM_000547,NM_001003009,NM_019353&#39;;</span></span>
<span class="line"><span>@acc_array = split(/,/, $acc_list);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#append [accn] field to each accession</span></span>
<span class="line"><span>for ($i=0; $i &lt; @acc_array; $i++) {</span></span>
<span class="line"><span>   $acc_array[$i] .= &quot;[accn]&quot;;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#join the accessions with OR</span></span>
<span class="line"><span>$query = join(&#39;+OR+&#39;,@acc_array);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#assemble the esearch URL</span></span>
<span class="line"><span>$base = &#39;https://eutils.ncbi.nlm.nih.gov/entrez/eutils/&#39;;</span></span>
<span class="line"><span>$url = $base . &quot;esearch.fcgi?db=nuccore&amp;term=$query&amp;usehistory=y&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#post the esearch URL</span></span>
<span class="line"><span>$output = get($url);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#parse WebEnv and QueryKey</span></span>
<span class="line"><span>$web = $1 if ($output =~ /&lt;WebEnv&gt;(\\S+)&lt;\\/WebEnv&gt;/);</span></span>
<span class="line"><span>$key = $1 if ($output =~ /&lt;QueryKey&gt;(\\d+)&lt;\\/QueryKey&gt;/);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#assemble the efetch URL</span></span>
<span class="line"><span>$url = $base . &quot;efetch.fcgi?db=nuccore&amp;query_key=$key&amp;WebEnv=$web&quot;;</span></span>
<span class="line"><span>$url .= &quot;&amp;rettype=fasta&amp;retmode=text&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#post the efetch URL</span></span>
<span class="line"><span>$fasta = get($url);</span></span>
<span class="line"><span>print &quot;$fasta&quot;;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><em><strong>Notes:*</strong> <em>For large numbers of accessions, use HTTP POST to submit the esearch request (see</em> <a href="https://www.ncbi.nlm.nih.gov/books/NBK25498/#chapter3.Application_4_Finding_unique_se" target="_blank" rel="noopener noreferrer"><em>Application 4</em></a></em>), and see* <a href="https://www.ncbi.nlm.nih.gov/books/NBK25498/#chapter3.Application_3_Retrieving_large" target="_blank" rel="noopener noreferrer"><em>Application 3</em></a> <em>below for downloading the large set in batches.</em></p><h2 id="application-3-retrieving-large-datasets" tabindex="-1"><a class="header-anchor" href="#application-3-retrieving-large-datasets"><span>Application 3: Retrieving large datasets</span></a></h2><p><strong>Goal:</strong> Download all chimpanzee mRNA sequences in FASTA format (&gt;50,000 sequences).</p><p><strong>Solution:</strong> First use ESearch to retrieve the GI numbers for these sequences and post them on the History server, then use multiple EFetch calls to retrieve the data in batches of 500.</p><p><strong>Input:</strong> $query – chimpanzee[orgn]+AND+biomol+mrna[prop]</p><p><strong>Output:</strong> A file named &quot;chimp.fna&quot; containing FASTA data.</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>use LWP::Simple;</span></span>
<span class="line"><span>$query = &#39;chimpanzee[orgn]+AND+biomol+mrna[prop]&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#assemble the esearch URL</span></span>
<span class="line"><span>$base = &#39;https://eutils.ncbi.nlm.nih.gov/entrez/eutils/&#39;;</span></span>
<span class="line"><span>$url = $base . &quot;esearch.fcgi?db=nucleotide&amp;term=$query&amp;usehistory=y&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#post the esearch URL</span></span>
<span class="line"><span>$output = get($url);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#parse WebEnv, QueryKey and Count (# records retrieved)</span></span>
<span class="line"><span>$web = $1 if ($output =~ /&lt;WebEnv&gt;(\\S+)&lt;\\/WebEnv&gt;/);</span></span>
<span class="line"><span>$key = $1 if ($output =~ /&lt;QueryKey&gt;(\\d+)&lt;\\/QueryKey&gt;/);</span></span>
<span class="line"><span>$count = $1 if ($output =~ /&lt;Count&gt;(\\d+)&lt;\\/Count&gt;/);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#open output file for writing</span></span>
<span class="line"><span>open(OUT, &quot;&gt;chimp.fna&quot;) || die &quot;Can&#39;t open file!\\n&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#retrieve data in batches of 500</span></span>
<span class="line"><span>$retmax = 500;</span></span>
<span class="line"><span>for ($retstart = 0; $retstart &lt; $count; $retstart += $retmax) {</span></span>
<span class="line"><span>        $efetch_url = $base .&quot;efetch.fcgi?db=nucleotide&amp;WebEnv=$web&quot;;</span></span>
<span class="line"><span>        $efetch_url .= &quot;&amp;query_key=$key&amp;retstart=$retstart&quot;;</span></span>
<span class="line"><span>        $efetch_url .= &quot;&amp;retmax=$retmax&amp;rettype=fasta&amp;retmode=text&quot;;</span></span>
<span class="line"><span>        $efetch_out = get($efetch_url);</span></span>
<span class="line"><span>        print OUT &quot;$efetch_out&quot;;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>close OUT;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="application-4-finding-unique-sets-of-linked-records-for-each-member-of-a-large-dataset" tabindex="-1"><a class="header-anchor" href="#application-4-finding-unique-sets-of-linked-records-for-each-member-of-a-large-dataset"><span>Application 4: Finding unique sets of linked records for each member of a large dataset</span></a></h2><p><strong>Goal:</strong> Download separately the SNP rs numbers (identifiers) for each current gene on human chromosome 20.</p><p><strong>Solution:</strong> First use ESearch to retrieve the Gene IDs for the genes, and then assemble an ELink URL where each Gene ID is submitted as a separate &amp;id parameter.</p><p><strong>Input:</strong> $query – human[orgn]+AND+20[chr]+AND+alive[prop]</p><p><strong>Output:</strong> A file named &quot;snp_table&quot; containing on each line the gene id followed by a colon (&quot;😊 followed by a comma-delimited list of the linked SNP rs numbers.</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>use LWP::Simple;</span></span>
<span class="line"><span>use LWP::UserAgent;</span></span>
<span class="line"><span>$query = &#39;human[orgn]+AND+20[chr]+AND+alive[prop]&#39;;</span></span>
<span class="line"><span>$db1 = &#39;gene&#39;;</span></span>
<span class="line"><span>$db2 = &#39;snp&#39;;</span></span>
<span class="line"><span>$linkname = &#39;gene_snp&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#assemble the esearch URL</span></span>
<span class="line"><span>$base = &#39;https://eutils.ncbi.nlm.nih.gov/entrez/eutils/&#39;;</span></span>
<span class="line"><span>$url = $base . &quot;esearch.fcgi?db=$db1&amp;term=$query&amp;usehistory=y&amp;retmax=5000&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#post the esearch URL</span></span>
<span class="line"><span>$output = get($url);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#parse IDs retrieved</span></span>
<span class="line"><span>while ($output =~ /&lt;Id&gt;(\\d+?)&lt;\\/Id&gt;/sg) {</span></span>
<span class="line"><span>   push(@ids, $1);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#assemble  the elink URL as an HTTP POST call</span></span>
<span class="line"><span>$url = $base . &quot;elink.fcgi&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>$url_params = &quot;dbfrom=$db1&amp;db=$db2&amp;linkname=$linkname&quot;;</span></span>
<span class="line"><span>foreach $id (@ids) {      </span></span>
<span class="line"><span>   $url_params .= &quot;&amp;id=$id&quot;;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#create HTTP user agent</span></span>
<span class="line"><span>$ua = new LWP::UserAgent;</span></span>
<span class="line"><span>$ua-&gt;agent(&quot;elink/1.0 &quot; . $ua-&gt;agent);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#create HTTP request object</span></span>
<span class="line"><span>$req = new HTTP::Request POST =&gt; &quot;$url&quot;;</span></span>
<span class="line"><span>$req-&gt;content_type(&#39;application/x-www-form-urlencoded&#39;);</span></span>
<span class="line"><span>$req-&gt;content(&quot;$url_params&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#post the HTTP request</span></span>
<span class="line"><span>$response = $ua-&gt;request($req); </span></span>
<span class="line"><span>$output = $response-&gt;content;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>open (OUT, &quot;&gt;snp_table&quot;) || die &quot;Can&#39;t open file!\\n&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>while ($output =~ /&lt;LinkSet&gt;(.*?)&lt;\\/LinkSet&gt;/sg) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   $linkset = $1;</span></span>
<span class="line"><span>   if ($linkset =~ /&lt;IdList&gt;(.*?)&lt;\\/IdList&gt;/sg) {</span></span>
<span class="line"><span>      $input = $1;</span></span>
<span class="line"><span>      $input_id = $1 if ($input =~ /&lt;Id&gt;(\\d+)&lt;\\/Id&gt;/sg); </span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   while ($linkset =~ /&lt;Link&gt;(.*?)&lt;\\/Link&gt;/sg) {</span></span>
<span class="line"><span>      $link = $1;</span></span>
<span class="line"><span>      push (@output, $1) if ($link =~ /&lt;Id&gt;(\\d+)&lt;\\/Id&gt;/);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>      </span></span>
<span class="line"><span>   print OUT &quot;$input_id:&quot; . join(&#39;,&#39;, @output) . &quot;\\n&quot;;</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>close OUT;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>*<strong>Notes:*</strong> <em>This example uses an HTTP POST request for the elink call, as the number of Gene IDs is over 500. The &amp;retmax parameter in the ESearch call is set to 5000, as this is a reasonable limit to the number of IDs to send to ELink in one request (if you send 5000 IDs, you are effectively performing 5000 ELink operations). If you need to link more than 5000 records, add &amp;retstart to the ESearch call and repeat the entire procedure for each batch of 5000 IDs, incrementing &amp;retstart for each batch.</em></p><h2 id="demonstration-programs" tabindex="-1"><a class="header-anchor" href="#demonstration-programs"><span>Demonstration Programs</span></a></h2><p>Please see <a href="https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter1/#chapter1.Demonstration_Programs" target="_blank" rel="noopener noreferrer">Chapter 1</a> for sample Perl scripts.</p><h2 id="for-more-information" tabindex="-1"><a class="header-anchor" href="#for-more-information"><span>For More Information</span></a></h2><p>Please see <a href="https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter1/#chapter1.For_More_Information_8" target="_blank" rel="noopener noreferrer">Chapter 1</a> for getting additional information about the E-utilities.</p>`,78),p=[l];function t(r,c){return e(),n("div",null,p)}const u=s(i,[["render",t],["__file","03-Sample Applications of the E-utilities_EN.html.vue"]]),m=JSON.parse('{"path":"/E-utilities_EN/03-Sample%20Applications%20of%20the%20E-utilities_EN.html","title":"Sample Applications of the E-utilities","lang":"zh-CN","frontmatter":{"order":3,"description":"Sample Applications of the E-utilities Eric Sayers, PhD. Author Information and Affiliations Authors Eric Sayers, PhDcorresponding author1. Affilitions 1 NCBI Email: vog.hin.mln...","head":[["meta",{"property":"og:url","content":"https://vuepress-theme-hope-docs-demo.netlify.app/E-utilities_zh-CN/E-utilities_EN/03-Sample%20Applications%20of%20the%20E-utilities_EN.html"}],["meta",{"property":"og:site_name","content":"E-utilities 汉化文档"}],["meta",{"property":"og:title","content":"Sample Applications of the E-utilities"}],["meta",{"property":"og:description","content":"Sample Applications of the E-utilities Eric Sayers, PhD. Author Information and Affiliations Authors Eric Sayers, PhDcorresponding author1. Affilitions 1 NCBI Email: vog.hin.mln..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://www.ncbi.nlm.nih.gov/corehtml/pmc/pmcgifs/corrauth.gif"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-06-21T12:28:18.000Z"}],["meta",{"property":"article:author","content":"WhyLIM"}],["meta",{"property":"article:modified_time","content":"2024-06-21T12:28:18.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Sample Applications of the E-utilities\\",\\"image\\":[\\"https://www.ncbi.nlm.nih.gov/corehtml/pmc/pmcgifs/corrauth.gif\\",\\"https://www.ncbi.nlm.nih.gov/corehtml/pmc/pmcgifs/corrauth.gif\\"],\\"dateModified\\":\\"2024-06-21T12:28:18.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"WhyLIM\\",\\"url\\":\\"https://github.com/WhyLIM\\"}]}"]]},"headers":[{"level":2,"title":"Introduction","slug":"introduction","link":"#introduction","children":[]},{"level":2,"title":"Basic Pipelines","slug":"basic-pipelines","link":"#basic-pipelines","children":[]},{"level":2,"title":"ESearch – ESummary/EFetch","slug":"esearch-–-esummary-efetch","link":"#esearch-–-esummary-efetch","children":[]},{"level":2,"title":"EPost – ESummary/EFetch","slug":"epost-–-esummary-efetch","link":"#epost-–-esummary-efetch","children":[]},{"level":2,"title":"ELink – ESummary/Efetch","slug":"elink-–-esummary-efetch","link":"#elink-–-esummary-efetch","children":[]},{"level":2,"title":"ESearch – ELink – ESummary/EFetch","slug":"esearch-–-elink-–-esummary-efetch","link":"#esearch-–-elink-–-esummary-efetch","children":[]},{"level":2,"title":"EPost – ELink – ESummary/EFetch","slug":"epost-–-elink-–-esummary-efetch","link":"#epost-–-elink-–-esummary-efetch","children":[]},{"level":2,"title":"EPost – ESearch","slug":"epost-–-esearch","link":"#epost-–-esearch","children":[]},{"level":2,"title":"ELink – ESearch","slug":"elink-–-esearch","link":"#elink-–-esearch","children":[]},{"level":2,"title":"Application 1: Converting GI numbers to accession numbers","slug":"application-1-converting-gi-numbers-to-accession-numbers","link":"#application-1-converting-gi-numbers-to-accession-numbers","children":[]},{"level":2,"title":"Application 2: Converting accession numbers to data","slug":"application-2-converting-accession-numbers-to-data","link":"#application-2-converting-accession-numbers-to-data","children":[]},{"level":2,"title":"Application 3: Retrieving large datasets","slug":"application-3-retrieving-large-datasets","link":"#application-3-retrieving-large-datasets","children":[]},{"level":2,"title":"Application 4: Finding unique sets of linked records for each member of a large dataset","slug":"application-4-finding-unique-sets-of-linked-records-for-each-member-of-a-large-dataset","link":"#application-4-finding-unique-sets-of-linked-records-for-each-member-of-a-large-dataset","children":[]},{"level":2,"title":"Demonstration Programs","slug":"demonstration-programs","link":"#demonstration-programs","children":[]},{"level":2,"title":"For More Information","slug":"for-more-information","link":"#for-more-information","children":[]}],"git":{"createdTime":1718972898000,"updatedTime":1718972898000,"contributors":[{"name":"Mli-TB","email":"mli.bio@outlook.com","commits":1}]},"readingTime":{"minutes":10.41,"words":3124},"filePathRelative":"E-utilities_EN/03-Sample Applications of the E-utilities_EN.md","localizedDate":"2024年6月21日","autoDesc":true}');export{u as comp,m as data};
