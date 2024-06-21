---
order: 1
---

# E-utilities 快速入门指南

> Eric Sayers, PhD.
>
> [作者信息和隶属关系](https://www.ncbi.nlm.nih.gov/books/NBK25498/#__NBK25498_ai__)
>
> **作者**
>
> Eric Sayers, PhD ![通讯作者](https://www.ncbi.nlm.nih.gov/corehtml/pmc/pmcgifs/corrauth.gif)1.
>
> **隶属关系**
>
> 1 NCBI
>
> 邮箱: [vog.hin.mln.ibcn@sreyas](mailto:dev@null)
>
> ![通讯作者](https://www.ncbi.nlm.nih.gov/corehtml/pmc/pmcgifs/corrauth.gif)通讯作者.
>
> 创建时间：2008 年 12 月 12 日；最后更新：2018 年 10 月 24 日。
>
> *预计阅读时间：10 分钟*

## 版本说明

请参阅我们的 [版本说明](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter4/#chapter4.Release_Notes) 以了解最近的更改和更新。

## 公告

从 2018 年 12 月 1 日起，NCBI 将开始强制使用新的 API 密钥进行 E-utility 调用。有关此重要更改的更多详细信息，请参阅 [第 2 章](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter2/)。

## 介绍

本章提供了基本 E-utility 功能的简要概述，并附有 URL 调用示例。有关这些实用程序的一般介绍，请参阅 [第 2 章](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter2/)，有关语法和参数的详细讨论，请参阅 [第 4 章](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter4/)。

*示例* 包括提供样本输出的实时 URL。

所有 E-utility 调用共享相同的基本 URL：

```
https://eutils.ncbi.nlm.nih.gov/entrez/eutils/
```

## 搜索数据库

### 基本搜索

```
esearch.fcgi?db=<database>&term=<query>
```

输入：Entrez 数据库 (&db)；任何 Entrez 文本查询 (&term)

输出：与 Entrez 查询匹配的 UID 列表

*示例：获取 2008 年在《科学》杂志上发表的关于乳腺癌的文章的 PubMed ID（PMID）*

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=science[journal]+AND+breast+cancer+AND+2008[pdat]**

### 存储搜索结果

```
esearch.fcgi?db=<database>&term=<query>&usehistory=y
```

输入：任何 Entrez 文本查询 (&term)；Entrez 数据库 (&db)；&usehistory=y

输出：指定 Entrez 查询匹配的 UID 列表位置的网络环境 (&WebEnv) 和查询键 (&query_key) 参数

*示例：获取 2008 年在《科学》杂志上发表的关于乳腺癌的文章的 PubMed ID（PMID），并将它们存储在 Entrez 历史服务器上以便以后使用*

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=science[journal]+AND+breast+cancer+AND+2008[pdat]&usehistory=y**

### 将搜索结果与现有搜索结果关联

```
esearch.fcgi?db=<database>&term=<query1>&usehistory=y

# esearch 产生 WebEnv 值 ($web1) 和 QueryKey 值 ($key1) 

esearch.fcgi?db=<database>&term=<query2>&usehistory=y&WebEnv=$web1

# esearch 产生包含两个搜索结果 ($key1 和 $key2) 的 WebEnv 值 ($web2)
```

输入：任何 Entrez 文本查询 (&term)；Entrez 数据库 (&db)；&usehistory=y；先前 E-utility 调用的现有网络环境 (&WebEnv)

输出：指定 Entrez 查询匹配的 UID 列表位置的网络环境 (&WebEnv) 和查询键 (&query_key) 参数

### 更多信息

请参阅 [ESearch 深入研究](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter4/#chapter4.ESearch) 了解 ESearch 的完整描述。

### ESearch 输出示例

```xml
<?xml version="1.0" ?>
<!DOCTYPE eSearchResult PUBLIC "-//NLM//DTD eSearchResult, 11 May 2002//EN"
 "https://www.ncbi.nlm.nih.gov/entrez/query/DTD/eSearch_020511.dtd">
<eSearchResult>
<Count>255147</Count>   # 匹配查询的记录总数
<RetMax>20</RetMax># 此 XML 中返回的 UID 数；默认值=20
<RetStart>0</RetStart># 返回的第一条记录的索引；默认值=0
<QueryKey>1</QueryKey># QueryKey，仅当&usehistory=y 时存在
<WebEnv>0l93yIkBjmM60UBXuvBvPfBIq8-9nIsldXuMP0hhuMH-8GjCz7F_Dz1XL6z@397033B29A81FB01_0038SID</WebEnv># WebEnv，仅当&usehistory=y 时存在
<IdList>
<Id>229486465</Id>    # 返回的 UID 列表
<Id>229486321</Id>
<Id>229485738</Id>
<Id>229470359</Id>
<Id>229463047</Id>
<Id>229463037</Id>
<Id>229463022</Id>
<Id>229463019</Id>
<Id>229463007</Id>
<Id>229463002</Id>
<Id>229463000</Id>
<Id>229462974</Id>
<Id>229462961</Id>
<Id>229462956</Id>
<Id>229462921</Id>
<Id>229462905</Id>
<Id>229462899</Id>
<Id>229462873</Id>
<Id>229462863</Id>
<Id>229462862</Id>
</IdList>
<TranslationSet>        # Entrez 如何翻译查询的详细信息
    <Translation>
     <From>mouse[orgn]</From>
     <To>"Mus musculus"[Organism]</To>
    </Translation>
</TranslationSet>
<TranslationStack>
   <TermSet>
    <Term>"Mus musculus"[Organism]</Term>
    <Field>Organism</Field>
    <Count>255147</Count>
    <Explode>Y</Explode>
   </TermSet>
   <OP>GROUP</OP>
</TranslationStack>
<QueryTranslation>"Mus musculus"[Organism]</QueryTranslation>
</eSearchResult>
```

### 使用引文数据搜索 PubMed

```
ecitmatch.cgi?db=pubmed&rettype=xml&bdata=<citations>
```

输入：以回车符 (%0D) 分隔的引文字符串列表，其中每个引文字符串的格式如下：

journal_title|year|volume|first_page|author_name|your_key|

*输出：附有相应 PubMed ID (PMID) 的引文字符串列表。*

*示例：使用以下引文搜索 PubMed：*

Art1: Mann, BJ. (1991) *Proc. Natl. Acad. Sci. USA.* 88:3248

Art2: Palmenberg, AC. (1987) *Science* 235:182

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/ecitmatch.cgi?db=pubmed&retmode=xml&bdata=proc+natl+acad+sci+u+s+a|1991|88|3248|mann+bj|Art1|%0Dscience|1987|235|182|palmenberg+ac|Art2|**

输出示例（PMID 出现在最右边的字段中）：

```
proc natl acad sci u s a|1991|88|3248|mann bj|Art1|2014248
science|1987|235|182|palmenberg ac|Art2|3026048
```

请参阅 [ECitMatch 深入研究](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter4/#chapter4.ECitMatch) 了解 ECitMatch 的完整描述。

## 将 UID 上传到 Entrez

### 基本上传

```
epost.fcgi?db=<database>&id=<uid_list>
```

输入：UID 列表 (&id)；Entrez 数据库 (&db)

输出：指定上传的 UID 列表位置的网络环境 (&WebEnv) 和查询键 (&query_key) 参数

*示例：上传五个基因 ID（7173,22018,54314,403521,525013）以供以后处理。*

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/epost.fcgi?db=gene&id=7173,22018,54314,403521,525013**

### 将一组 UID 与先前发布的集合关联

```
epost.fcgi?db=<database1>&id=<uid_list1>

# epost 产生 WebEnv 值 ($web1) 和 QueryKey 值 ($key1)

epost.fcgi?db=<database2>&id=<uid_list2>&WebEnv=$web1

# epost 产生包含两个发布结果 ($key1 和 $key2) 的 WebEnv 值 ($web2)
```

输入：UID 列表 (&id)；Entrez 数据库 (&db)；现有网络环境 (&WebEnv)

输出：指定上传的 UID 列表位置的网络环境 (&WebEnv) 和查询键 (&query_key) 参数

### 更多信息

请参阅 [EPost 深入研究](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter4/#chapter4.EPost) 了解 EPost 的完整描述。

### EPost 输出示例

```xml
<?xml version="1.0"?>
<!DOCTYPE ePostResult PUBLIC "-//NLM//DTD ePostResult, 11 May 2002//EN"
 "https://www.ncbi.nlm.nih.gov/entrez/query/DTD/ePost_020511.dtd">
<ePostResult>
<QueryKey>1</QueryKey>
<WebEnv>NCID_01_268116914_130.14.18.47_9001_1241798628</WebEnv>
</ePostResult>
```

## 下载文档摘要

### 基本下载

```
esummary.fcgi?db=<database>&id=<uid_list>
```

输入：UID 列表 (&id)；Entrez 数据库 (&db)

输出：XML 文档摘要

*示例：下载这些蛋白质 GIs 的文档摘要：6678417,9507199,28558982,28558984,28558988,28558990*

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=protein&id=6678417,9507199,28558982,28558984,28558988,28558990**

### 从先前的搜索中下载数据

```
esearch.fcgi?db=<database>&term=<query>&usehistory=y

# esearch 产生 WebEnv 值 ($web1) 和 QueryKey 值 ($key1)

esummary.fcgi?db=<database>&query_key=$key1&WebEnv=$web1
```

输入：表示 Entrez 历史服务器上 Entrez UID 集合的网络环境 (&WebEnv) 和查询键 (&query_key)

输出：XML 文档摘要

### ESummary 输出示例

ESummary 的输出是一系列 XML“DocSums”（文档摘要），其格式取决于数据库。以下是 Entrez 蛋白质的一个示例 DocSum。

```xml
<?xml version="1.0"?>
<!DOCTYPE eSummaryResult PUBLIC "-//NLM//DTD eSummaryResult, 29 October
 2004//EN" "https://www.ncbi.nlm.nih.gov/entrez/query/DTD/eSummary_
041029.dtd">
<eSummaryResult>
<DocSum>
<Id>15718680</Id>
<Item Name="Caption" Type="String">NP_005537</Item>
<Item Name="Title" Type="String">IL2 诱导的 T 细胞激酶 [人]</Item>
<Item Name="Extra" 
Type="String">gi|15718680|ref|NP_005537.3|[15718680]</Item>
<Item Name="Gi" Type="Integer">15718680</Item>
<Item Name="CreateDate" Type="String">1999/06/09</Item>
<Item Name="UpdateDate" Type="String">2009/04/05</Item>
<Item Name="Flags" Type="Integer">512</Item>
<Item Name="TaxId" Type="Integer">9606</Item>
<Item Name="Length" Type="Integer">620</Item>
<Item Name="Status" Type="String">live</Item>
<Item Name="ReplacedBy" Type="String"></Item>
<Item Name="Comment" Type="String"><![CDATA[  ]]></Item>
</DocSum>
</eSummaryResult>
```

### ESummary 版本 2.0 输出示例

ESummary 的 2.0 版本是 Entrez DocSums 的替代 XML 表示形式。要检索 2.0 版本的 DocSums，URL 应包含带有‘2.0’值的&version 参数。每个 Entrez 数据库提供其自己的唯一 DTD 用于 2.0 版本的 DocSums，相关 DTD 的链接位于 2.0 版本 XML 的标题中。

```
esummary.fcgi?db=<database>&id=<uid_list>&version=2.0
```

以下是 Entrez 蛋白质的一个 2.0 版本的 DocSum 示例（与上述默认 DocSum XML 中的记录相同）。

```xml
<?xml version="1.0"?>
<!DOCTYPE eSummaryResult PUBLIC "-//NLM//DTD eSummaryResult//EN" "https://www.ncbi.nlm.nih.gov/entrez/query/DTD/eSummaryDTD/eSummary_protein.dtd">
<eSummaryResult>
    <DocumentSummarySet status="OK">
        <DocumentSummary uid="15718680">
            <Caption>NP_005537</Caption>
            <Title>酪氨酸-蛋白激酶 ITK/TSK [人]</Title>
            <Extra>gi|15718680|ref|NP_005537.3|</Extra>
            <Gi>15718680</Gi>

            <CreateDate>1999/06/09</CreateDate>
            <UpdateDate>2011/10/09</UpdateDate>
            <Flags>512</Flags>
            <TaxId>9606</TaxId>
            <Slen>620</Slen>

            <Biomol/>

            <MolType>aa</MolType>
            <Topology>linear</Topology>
            <SourceDb>refseq</SourceDb>
            <SegSetSize>0</SegSetSize>
            <ProjectId>0</ProjectId>
            <Genome>genomic</Genome>

            <SubType>chromosome|map</SubType>
            <SubName>5|5q31-q32</SubName>
            <AssemblyGi>399658</AssemblyGi>
            <AssemblyAcc>D13720.1</AssemblyAcc>
            <Tech/>
            <Completeness/>
            <GeneticCode>1</GeneticCode>

            <Strand/>
            <Organism>人</Organism>
            <Statistics>
                <Stat type="all" count="8"/>
                <Stat type="blob_size" count="16154"/>
                <Stat type="cdregion" count="1"/>
                <Stat type="cdregion" subtype="CDS" count="1"/>
                <Stat type="gene" count="1"/>
                <Stat type="gene" subtype="Gene" count="1"/>
                <Stat type="org" count="1"/>
                <Stat type="prot" count="1"/>
                <Stat type="prot" subtype="Prot" count="1"/>
                <Stat type="pub" count="14"/>
                <Stat type="pub" subtype="PubMed" count="10"/>
                <Stat type="pub" subtype="PubMed/Gene-rif" count="4"/>
                <Stat type="site" count="4"/>
                <Stat type="site" subtype="Site" count="4"/>
                <Stat source="CDD" type="all" count="15"/>
                <Stat source="CDD" type="region" count="6"/>
                <Stat source="CDD" type="region" subtype="Region" count="6"/>
                <Stat source="CDD" type="site" count="9"/>
                <Stat source="CDD" type="site" subtype="Site" count="9"/>
                <Stat source="HPRD" type="all" count="3"/>
                <Stat source="HPRD" type="site" count="3"/>
                <Stat source="HPRD" type="site" subtype="Site" count="3"/>
                <Stat source="SNP" type="all" count="31"/>
                <Stat source="SNP" type="imp" count="31"/>
                <Stat source="SNP" type="imp" subtype="variation" count="31"/>
                <Stat source="all" type="all" count="57"/>
                <Stat source="all" type="blob_size" count="16154"/>
                <Stat source="all" type="cdregion" count="1"/>
                <Stat source="all" type="gene" count="1"/>
                <Stat source="all" type="imp" count="31"/>
                <Stat source="all" type="org" count="1"/>
                <Stat source="all" type="prot" count="1"/>
                <Stat source="all" type="pub" count="14"/>
                <Stat source="all" type="region" count="6"/>
                <Stat source="all" type="site" count="16"/>
            </Statistics>
            <AccessionVersion>NP_005537.3</AccessionVersion>
            <Properties aa="2">2</Properties>
            <Comment/>
            <OSLT indexed="yes">NP_005537.3</OSLT>
            <IdGiClass mol="3" repr="2" gi_state="10" sat="4" sat_key="58760802" owner="20"
                sat_name="NCBI" owner_name="NCBI-Genomes" defdiv="GNM" length="620" extfeatmask="41"
            />
        </DocumentSummary>

    </DocumentSummarySet>
</eSummaryResult>
```

## 下载完整记录

### 基本下载

```
efetch.fcgi?db=<database>&id=<uid_list>&rettype=<retrieval_type>&retmode=<retrieval_mode>
```

输入：UID 列表 (&id)；Entrez 数据库 (&db)；检索类型 (&rettype)；检索模式 (&retmode)

输出：按指定格式的数据记录

*示例：以 FASTA 格式下载 nuccore GIs 34577062 和 24475906*

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nuccore&id=34577062,24475906&rettype=fasta&retmode=text**

### 从先前的搜索中下载数据

```
esearch.fcgi?db=<database>&term=<query>&usehistory=y

# esearch 产生 WebEnv 值 ($web1) 和 QueryKey 值 ($key1)

efetch.fcgi?db=<database>&query_key=$key1&WebEnv=$web1&rettype=<retrieval_type>&retmode=<retrieval_mode>
```

输入：Entrez 数据库 (&db)；表示 Entrez 历史服务器上 Entrez UID 集合的网络环境 (&WebEnv) 和查询键 (&query_key)；检索类型 (&rettype)；检索模式 (&retmode)

输出：按指定格式的数据记录

### 下载大量记录

**请参阅** [第 3 章的应用 3](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter3/#chapter3.Application_3_Retrieving_large)

输入：Entrez 数据库 (&db)；表示 Entrez 历史服务器上 Entrez UID 集合的网络环境 (&WebEnv) 和查询键 (&query_key)；检索起始 (&retstart)，要检索的集合的第一条记录；检索最大值 (&retmax)，要检索的记录最大数

输出：按指定格式的数据记录

### 更多信息

请参阅 [EFetch 深入研究](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter4/#chapter4.EFetch) 了解 EFetch 的完整描述。

## 通过 Entrez 链接查找相关数据

### 基本链接

#### 批处理模式 – 仅查找一组链接 UID

```
elink.fcgi?dbfrom=<source_db>&db=<destination_db>&id=<uid_list>
```

输入：UID 列表 (&id)；源 Entrez 数据库 (&dbfrom)；目标 Entrez 数据库 (&db)

输出：包含源和目标数据库链接 UID 的 XML

*示例：查找与 nuccore GIs 34577062 和 24475906 链接的一组基因 ID*

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=nuccore&db=gene&id=34577062,24475906**

#### ‘By Id’模式 – 为每个输入 UID 查找一组链接 UID

```
elink.fcgi?dbfrom=<source_db>&db=<destination_db>&id=<uid1>&id=<uid2>&id=<uid3>...
```

*示例：查找与 nuccore GIs 34577062 和 24475906 分别链接的一组基因 ID*

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=nuccore&db=gene&id=34577062&id=24475906**

*注意：&db 可以是逗号分隔的数据库列表，以便 elink 在一次调用中返回多个链接 UID 集*

### 查找来自先前搜索的数据链接

```
esearch.fcgi?db=<source_db>&term=<query>&usehistory=y

# esearch 产生 WebEnv 值 ($web1) 和 QueryKey 值 ($key1)

elink.fcgi?dbfrom=<source_db>&db=<destination_db>&query_key=$key1&WebEnv=$web1&cmd=neighbor_history
```

输入：源 Entrez 数据库 (&dbfrom)；目标 Entrez 数据库 (&db)；表示源 UID 集合的网络环境 (&WebEnv) 和查询键 (&query_key)；命令模式 (&cmd)

输出：包含每组链接 UID 的网络环境和查询键的 XML

*注意：要实现‘By Id’模式，必须在 URL 中将每个输入 UID 作为单独的&id 参数发送。发送 WebEnv/query_key 集合始终会产生批处理模式行为（一个链接 UID 集合）。*

### 通过 Entrez 搜索限制计算邻居

```
elink.fcgi?dbfrom=<source_db>&db=<source_db>&id=<uid_list>&term=<query>&cmd=neighbor_history
```

输入：源 Entrez 数据库 (&dbfrom)；目标 Entrez 数据库 (&db)；UID 列表 (&id)；Entrez 查询 (&term)；命令模式 (&cmd)

输出：包含每组链接 UID 的网络环境和查询键的 XML

*示例：查找大鼠参考序列且与 GI 15718680 序列相似的蛋白质 UID*

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=protein&db=protein&id=15718680&term=rat[orgn]+AND+srcdb+refseq[prop]&cmd=neighbor_history**

### 更多信息

请参阅 [ELink 深入研究](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter4/#chapter4.ELink) 了解 ELink 的完整描述。

## 获取数据库统计信息和搜索字段

```
einfo.fcgi?db=<database>
```

输入：Entrez 数据库 (&db)

输出：包含数据库统计信息的 XML

*注意：如果没有提供数据库参数，einfo 将返回所有有效 Entrez 数据库的列表。*

*示例：查找 Entrez 蛋白质的数据库统计信息。*

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/einfo.fcgi?db=protein**

### 更多信息

请参阅 [EInfo 深入研究](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter4/#chapter4.EInfo) 了解 EInfo 的完整描述。

### EInfo 输出示例

```xml
<?xml version="1.0"?>
<!DOCTYPE eInfoResult PUBLIC "-//NLM//DTD eInfoResult, 11 May 2002//EN" 
"https://www.ncbi.nlm.nih.gov/entrez/query/DTD/eInfo_020511.dtd">
<eInfoResult>
<DbInfo>
<DbName>protein</DbName>
<MenuName>Protein</MenuName>
<Description>蛋白质序列记录</Description>
<Count>26715092</Count>
<LastUpdate>2009/05/12 04:39</LastUpdate>
<FieldList>
<Field>
<Name>ALL</Name>
<FullName>所有字段</FullName>
<Description>所有可搜索字段的所有术语</Description>
<TermCount>133639432</TermCount>
<IsDate>N</IsDate>
<IsNumerical>N</IsNumerical>
<SingleToken>N</SingleToken>
<Hierarchy>N</Hierarchy>
<IsHidden>N</IsHidden>
</Field>
...
<Field>
<Name>PORG</Name>
<FullName>主要生物体</FullName>
<Description>主要生物体的科学名称和常用名称，以及所有较高级别的分类</Description>
<TermCount>673555</TermCount>
<IsDate>N</IsDate>
<IsNumerical>N</IsNumerical>
<SingleToken>Y</SingleToken>
<Hierarchy>Y</Hierarchy>
<IsHidden>N</IsHidden>
</Field>
</FieldList>
<LinkList>
<Link>
<Name>protein_biosystems</Name>
<Menu>生物系统链接</Menu>
<Description>生物系统</Description>
<DbTo>biosystems</DbTo>
</Link>
...
<Link>
<Name>protein_unigene</Name>
<Menu>UniGene 链接</Menu>
<Description>相关 UniGene 记录</Description>
<DbTo>unigene</DbTo>
</Link>
</LinkList>
</DbInfo>
</eInfoResult>
```

## 执行全局 Entrez 搜索

```
egquery.fcgi?term=<query>
```

输入：Entrez 文本查询 (&term)

输出：包含每个数据库命中数的 XML。

*示例：确定 Entrez 中鼠的记录数。*

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/egquery.fcgi?term=mouse[orgn]**

### 更多信息

请参阅 [EGQuery 深入研究](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter4/#chapter4.EGQuery) 了解 EGQuery 的完整描述。

### EGQuery 输出示例

```xml
<?xml version="1.0"?>
<!DOCTYPE Result PUBLIC "-//NLM//DTD eSearchResult, January 2004//EN"
 "https://www.ncbi.nlm.nih.gov/entrez/query/DTD/egquery.dtd">
<!--
        $Id: egquery_template.xml 106311 2007-06-26 14:46:31Z osipov $
-->
<!-- ================================================================= -->
<Result>
        <Term>mouse[orgn]</Term>
        <eGQueryResult>
             <ResultItem>
                  <DbName>pubmed</DbName>
                  <MenuName>PubMed</MenuName>
                  <Count>0</Count>
                  <Status>Term or Database is not found</Status>
             </ResultItem>
             <ResultItem>
                  <DbName>pmc</DbName>
                  <MenuName>PMC</MenuName>
                  <Count>3823</Count>
                  <Status>Ok</Status>
             </ResultItem>
...
             <ResultItem>
                  <DbName>nuccore</DbName>
                  <MenuName>核酸核心数据库</MenuName>
                  <Count>1739903</Count>
                  <Status>Ok</Status>
             </ResultItem>
             <ResultItem>
                  <DbName>nucgss</DbName>
                  <MenuName>GSS</MenuName>
                  <Count>2264567</Count>
                  <Status>Ok</Status>
             </ResultItem>
             <ResultItem>
                  <DbName>nucest</DbName>
                  <MenuName>EST</MenuName>
                  <Count>4852140</Count>
                  <Status>Ok</Status>
             </ResultItem>
             <ResultItem>
                  <DbName>protein</DbName>
                  <MenuName>蛋白质</MenuName>
                  <Count>255212</Count>
                  <Status>Ok</Status>
             </ResultItem>
...
             <ResultItem>
                  <DbName>proteinclusters</DbName>
                  <MenuName>蛋白质簇</MenuName>
                  <Count>13</Count>
                  <Status>Ok</Status>
             </ResultItem>
        </eGQueryResult>
</Result>
```

## 获取拼写建议

```
espell.fcgi?term=<query>&db=<database>
```

输入：Entrez 文本查询 (&term)；Entrez 数据库 (&db)

输出：包含原始查询和拼写建议的 XML。

*示例：查找“fiberblast cell grwth”在 PubMed Central 中的拼写建议。*

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/espell.fcgi?term=fiberblast+cell+grwth&db=pmc**

### 更多信息

请参阅 [ESpell 深入研究](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter4/#chapter4.ESpell) 了解 EGQuery 的完整描述。

### ESpell 输出示例

```xml
<?xml version="1.0"?>
<!DOCTYPE eSpellResult PUBLIC "-//NLM//DTD eSpellResult, 23 November 
2004//EN" "https://www.ncbi.nlm.nih.gov/entrez/query/DTD/eSpell.dtd">
<eSpellResult>
<Database>pmc</Database>
<Query>fiberblast cell grwth</Query>
<CorrectedQuery>fibroblast cell growth</CorrectedQuery>
<SpelledQuery>
 <Replaced>fibroblast</Replaced>
 <Original> cell </Original>
 <Replaced>growth</Replaced>
</SpelledQuery>
<ERROR/>
</eSpellResult>
```

## 演示程序

### EBot

[EBot](https://www.ncbi.nlm.nih.gov/Class/PowerTools/eutils/ebot/ebot.cgi) 是一个交互式 Web 工具，首先允许用户构建任意 E-utility 分析管道，然后生成执行该管道的 Perl 脚本。Perl 脚本可以下载并在任何安装了 Perl 的计算机上执行。有关详细信息，请参阅上面链接的 EBot 页面。

### Perl 脚本示例

以下两个 Perl 脚本示例演示了基本的 E-utility 功能。两个脚本均应复制并保存为纯文本文件，可以在任何安装了 Perl 的计算机上执行。

ESearch-EFetch 演示了基本的搜索和检索功能。

```perl
#!/usr/local/bin/perl -w
# =======================================================================
#
#                            公共领域声明
#               国家生物技术信息中心
#
#  本软件/数据库是“美国政府作品”，根据美国版权法条款，作者作为美国政府雇员的官方职责之一编写，因此不能获得版权。本软件/数据库可供公众自由使用。国家医学图书馆和美国政府对其使用或复制没有任何限制。
#
#  尽管已尽一切合理努力确保软件和数据的准确性和可靠性，但国家医学图书馆和美国政府不保证使用该软件或数据所能获得的性能或结果。国家医学图书馆和美国政府不提供任何明示或暗示的担保，包括性能、适销性或适合特定用途的担保。
#
#  请在基于此材料的任何工作或产品中引用作者。
#
# =======================================================================
#
# 作者：Oleg Khovayko
#
# 文件描述：eSearch/eFetch 调用示例
#  
# ---------------------------------------------------------------------
# 提示用户在下一部分中输入变量的子程序

sub ask_user {
  print "$_[0] [$_[1]]: ";
  my $rc = <>;
  chomp $rc;
  if($rc eq "") { $rc = $_[1]; }
  return $rc;
}

# ---------------------------------------------------------------------
# 定义在下一部分中使用的“get”函数的库。
# $utils 包含实用程序的路由。
# $db, $query 和$report 可能由用户在提示时提供；如果未回答，将分配默认值，如下所示。

use LWP::Simple;

my $utils = "https://www.ncbi.nlm.nih.gov/entrez/eutils";

my $db     = ask_user("数据库", "Pubmed");
my $query  = ask_user("查询",    "zanzibar");
my $report = ask_user("报告",   "abstract");

# ---------------------------------------------------------------------
# $esearch 包含 ESearch 调用的路径和参数
# $esearch_result 包含 ESearch 调用的结果
# 结果显示并解析为变量
# $Count, $QueryKey 和$WebEnv 以供以后使用，然后显示。

my $esearch = "$utils/esearch.fcgi?" .
              "db=$db&retmax=1&usehistory=y&term=";

my $esearch_result = get($esearch . $query);

print "\nESEARCH 结果：$esearch_result\n";

$esearch_result =~ 
  m|<Count>(\d+)</Count>.*<QueryKey>(\d+)</QueryKey>.*<WebEnv>(\S+)</WebEnv>|s;

my $Count    = $1;
my $QueryKey = $2;
my $WebEnv   = $3;

print "Count = $Count; QueryKey = $QueryKey; WebEnv = $WebEnv\n";

# ---------------------------------------------------------------------
# 此区域定义了一个循环，每次按下 Enter 键后显示 $retmax 引文结果，经过提示。

my $retstart;
my $retmax=3;

for($retstart = 0; $retstart < $Count; $retstart += $retmax) {
  my $efetch = "$utils/efetch.fcgi?" .
               "rettype=$report&retmode=text&retstart=$retstart&retmax=$retmax&" .
               "db=$db&query_key=$QueryKey&WebEnv=$WebEnv";
	
  print "\nEF_QUERY=$efetch\n";     

  my $efetch_result = get($efetch);
  
  print "---------\nEFETCH 结果 (". 
         ($retstart + 1) . ".." . ($retstart + $retmax) . "): ".
        "[$efetch_result]\n-----按 Enter 键！!!-------\n";
  <>;
}
```

EPost-ESummary 演示了基本的上传和文档摘要检索。

```perl
#!/usr/local/bin/perl -w
# =======================================================================
#
#                            公共领域声明
#               国家生物技术信息中心
#
#  本软件/数据库是“美国政府作品”，根据美国版权法条款，作者作为美国政府雇员的官方职责之一编写，因此不能获得版权。本软件/数据库可供公众自由使用。国家医学图书馆和美国政府对其使用或复制没有任何限制。
#
#  尽管已尽一切合理努力确保软件和数据的准确性和可靠性，但国家医学图书馆和美国政府不保证使用该软件或数据所能获得的性能或结果。国家医学图书馆和美国政府不提供任何明示或暗示的担保，包括性能、适销性或适合特定用途的担保。
#
#  请在基于此材料的任何工作或产品中引用作者。
#
# =======================================================================
#
# 作者：Oleg Khovayko
#
# 文件描述：ePost/eSummary 调用示例
#  

# ---------------------------------------------------------------------
my $eutils_root  = "https://www.ncbi.nlm.nih.gov/entrez/eutils";
my $ePost_url    = "$eutils_root/epost.fcgi";
my $eSummary_url = "$eutils_root/esummary.fcgi";

my $db_name = "PubMed";

# ---------------------------------------------------------------------
use strict;

use LWP::UserAgent;
use LWP::Simple;
use HTTP::Request;
use HTTP::Headers;
use CGI;

# ---------------------------------------------------------------------
# 将输入文件读入变量$file
# 文件名 - 第一个参数$ARGV[0]

undef $/;  #用于加载整个文件

open IF, $ARGV

[0] || die "无法打开读取文件：$!\n";
my $file = <IF>;
close IF;
print "加载的文件：[$file]\n";

# 准备文件 - 将所有分隔符替换为逗号

$file =~ s/\s+/,/gs;
print "准备好的文件：[$file]\n";

#创建 CGI 参数行

my $form_data = "db=$db_name&id=$file";

# ---------------------------------------------------------------------
# 创建 HTTP 请求

my $headers = new HTTP::Headers(
	Accept		=> "text/html, text/plain",
	Content_Type	=> "application/x-www-form-urlencoded"
);

my $request = new HTTP::Request("POST", $ePost_url, $headers );

$request->content($form_data);

# 创建用户代理对象

my $ua = new LWP::UserAgent;
$ua->agent("ePost/example");

# ---------------------------------------------------------------------
# 通过 HTTP 将文件发送到 ePost

my $response = $ua->request($request);

# ---------------------------------------------------------------------

print "响应状态消息：[" . $response->message . "]\n";
print "响应内容：[" .        $response->content . "]\n";

# ---------------------------------------------------------------------
# 解析 response->content 并提取 QueryKey 和 WebEnv
$response->content =~ 
  m|<QueryKey>(\d+)</QueryKey>.*<WebEnv>(\S+)</WebEnv>|s;

my $QueryKey = $1;
my $WebEnv   = $2;

print "\n 提取的内容：\nQueryKey = $QueryKey;\nWebEnv = $WebEnv\n\n";

# ---------------------------------------------------------------------
# 通过 simple::get 方法从 eSummary 检索 DocSum 并打印
#
print "eSummary 结果：[" . 
  get("$eSummary_url?db=$db_name&query_key=$QueryKey&WebEnv=$WebEnv") . 
  "]\n";
```

## 更多信息

### 公告邮件列表

NCBI 向 [utilities-announce 公告邮件列表](https://www.ncbi.nlm.nih.gov/mailman/listinfo/utilities-announce/) 发布有关 E-utility 的一般公告。此邮件列表仅用于公告；个别订阅者**不能**向列表发送邮件。此外，订阅者列表是私密的，不会与他人共享或以其他方式使用，除了向列表成员提供公告外。该列表每月约接收一次公告。请在上述链接处订阅。

### 获取帮助

有关搜索查询、数据库索引、字段限制和数据库内容的更多信息，请参阅 [PubMed](https://www.ncbi.nlm.nih.gov/books/n/helppubmed/pubmedhelp/) 和 [Entrez](https://www.ncbi.nlm.nih.gov/books/n/helpentrez/EntrezHelp/) 帮助文档。

具体与 EUtility 程序相关的建议、评论和问题可以发送至 [vog.hin.mln.ibcn@seitilitue](mailto:dev@null)。