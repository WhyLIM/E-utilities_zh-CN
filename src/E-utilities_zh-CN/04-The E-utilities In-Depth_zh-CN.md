---
order: 4
---

# E-utilities 深入：参数、语法等

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
> 邮箱：[vog.hin.mln.ibcn@sreyas](mailto:dev@null)
>
> ![通讯作者](https://www.ncbi.nlm.nih.gov/corehtml/pmc/pmcgifs/corrauth.gif) 通讯作者。
>
> 创建时间：2009 年 5 月 29 日；最后更新：2022 年 11 月 30 日。
>
> *预计阅读时间：20 分钟*

## 介绍

本章作为 E-utilities 所有支持参数的参考指南，包含接受的值和使用指南。以下各节提供了每个 E-utility 的相关信息，并在每节中讨论特定数据库的参数和/或值。大多数 E-utilities 具有一组用于任何调用的必需参数，另外还有几个可选参数来扩展工具的功能。这两组参数将在每节中分别讨论。

## 一般使用指南

请参阅 [第 2 章](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter2/) 以获取有关 E-utility 使用策略的详细讨论。以下两个参数应包含在所有 E-utility 请求中。

### tool

发出 E-utility 调用的应用程序名称。值必须是不含空格的字符串。

### email

E-utility 用户的电子邮件地址。值必须是不含空格的字符串，并且应为有效的电子邮件地址。

如果您预计从单个 IP 地址发布超过 3 个 E-utility 请求每秒，建议包含以下参数：

### **api_key**

适用于每秒发布超过 3 个请求的站点的 API 密钥值。请参阅 [第 2 章](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter2/) 以获取有关此政策的详细讨论。

## E-utilities DTDs

除 EFetch 外，E-utilities 每个都会生成符合特定 DTD 的单一 XML 输出格式。链接在这些 DTD 中的链接在 E-utility 返回的 XML 头中提供。

ESummary 版本 2.0 为每个 Entrez 数据库生成独特的 XML DocSums，因此每个 Entrez 数据库都有一个版本 2.0 DocSums 的独特 DTD。链接在版本 2.0 XML 中提供。

EFetch 以各种格式生成输出，其中一些是 XML 格式。这些 XML 格式大多数也符合特定于相关 Entrez 数据库的 DTD 或架构。请按照以下适当的链接获取 PubMed DTD：

- [PubMed DTD 2018 年 6 月 – 当前 PubMed DTD](http://dtd.nlm.nih.gov/ncbi/pubmed/out/pubmed_180601.dtd)
- [PubMed DTD 2019 年 1 月 – 即将推出的 DTD](http://dtd.nlm.nih.gov/ncbi/pubmed/out/pubmed_190101.dtd)

## EInfo

### 基础 URL

https://eutils.ncbi.nlm.nih.gov/entrez/eutils/einfo.fcgi

### 功能

- 提供所有有效 Entrez 数据库名称的列表
- 提供单个数据库的统计信息，包括索引字段列表和可用链接名称

### 必需参数

无。如果未提供 **db** 参数，einfo 将返回所有有效 Entrez 数据库名称的列表。

### 可选参数

#### db

目标数据库的统计信息。值必须是有效的 [Entrez 数据库名称](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter2/#chapter2.chapter2_table1)。

#### version

用于指定版本 2.0 EInfo XML。唯一支持的值是“2.0”。当存在时，EInfo 将返回包括两个新字段的 XML：`<IsTruncatable>` 和 `<IsRangeable>`。可截断字段允许术语中使用通配符字符'*'。通配符字符将扩展以匹配任何字符集，最大限制为 600 个唯一扩展。可范围化字段允许在所需范围的下限和上限之间使用范围运算符':'（例如 2008:2010[pdat]）。

#### retmode

检索类型。决定返回输出的格式。默认值为 EInfo XML 的“xml”，但也支持返回 JSON 格式的“json”。

### 示例

返回所有 Entrez 数据库名称的列表：

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/einfo.fcgi**

返回版本 2.0 的 Entrez Protein 统计信息：

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/einfo.fcgi?db=protein&version=2.0**

## ESearch

### 基础 URL

https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi

### 功能

- 提供与文本查询匹配的 UID 列表
- 将搜索结果发布到历史服务器
- 从历史服务器下载数据集中的所有 UID
- 组合或限制历史服务器上存储的 UID 数据集
- 对 UID 集进行排序

API 用户应注意，一些 NCBI 产品包含的搜索工具会在 Web 界面上生成内容，而这些内容在 ESearch 中不可用。例如，PubMed Web 界面（pubmed.ncbi.nlm.nih.gov）包含仅通过该界面提供的引用匹配和拼写纠正工具。请参阅下文的 ECitMatch 和 ESpell 以获取 API 等效项。

### 必需参数

#### db

要搜索的数据库。值必须是有效的 [Entrez 数据库名称](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter2/#chapter2.chapter2_table1)（默认值=pubmed）。

#### term

Entrez 文本查询。所有特殊字符必须进行 URL 编码。空格可用'+'号代替。对于非常长的查询（超过几百个字符），考虑使用 HTTP POST 调用。有关搜索字段描述和标签的信息，请参阅 [PubMed](https://pubmed.ncbi.nlm.nih.gov/help/) 或 [Entrez](https://www.ncbi.nlm.nih.gov/books/n/helpentrez/EntrezHelp/) 帮助。搜索字段和标签是数据库特定的。

```
esearch.fcgi?db=pubmed&term=asthma
```

PubMed 还提供 [“邻近搜索”](https://pubmed.ncbi.nlm.nih.gov/help/#proximity-searching)，用于在 [标题] 或 [标题/摘要] 字段中按任何顺序出现并在指定词数范围内的多个术语。

```
esearch.fcgi?db=pubmed&term="asthma treatment"[Title:~3]
```

### 可选参数 – 历史服务器

#### usehistory

当 **usehistory** 设置为 'y' 时，ESearch 会将搜索操作产生的 UID 发布到历史服务器，以便在随后的 E-utility 调用中直接使用。此外，**usehistory** 必须设置为 'y'，ESearch 才能解释包含在 **term** 中的查询键值或接受 **WebEnv** 作为输入。

#### WebEnv

从先前的 ESearch、EPost 或 ELink 调用中返回的 Web 环境字符串。当提供时，ESearch 会将搜索操作的结果发布到这个预先存在的 WebEnv，从而将结果附加到现有环境中。此外，提供 **WebEnv** 允许在 **term** 中使用查询键，以便可以组合或限制先前的搜索集。如上所述，如果使用 **WebEnv**，则必须将 **usehistory** 设置为 'y'。

```
esearch.fcgi?db=pubmed&term=asthma&WebEnv=<webenv string>&usehistory=y
```

#### query_key

由先前的 ESearch、EPost 或 ELink 调用返回的整数查询键。当提供时，ESearch 将查找由 **query_key** 指定的集合和 **term** 中查询检索到的集合的交集（即用 AND 连接这两个集合）。要使 **query_key** 起作用，**WebEnv** 必须分配一个现有的 WebEnv 字符串，并且 **usehistory** 必须设置为 'y'。

查询键的值也可以在 **term** 中提供，如果它们前面有 '#'（URL 中为 %23）。虽然 ESearch 只能提供一个 **query_key** 参数，但可以在 **term** 中组合任意数量的查询键。此外，如果在 **term** 中提供查询键，它们可以与 OR 或 NOT 一起组合，除了 AND。

```
以下两个 URL 在功能上是等价的：

esearch.fcgi?db=pubmed&term=asthma&query_key=1&WebEnv=<webenv string>&usehistory=y

esearch.fcgi?db=pubmed&term=%231+AND+asthma&WebEnv=<webenv string>&usehistory=y
```

### 可选参数 – 检索

#### retstart

在 XML 输出中显示的检索集中的第一个 UID 的顺序索引（默认=0，对应于整个集合中的第一条记录）。可以与 **retmax** 一起使用此参数，从搜索中检索到的 UID 中下载任意子集。

#### retmax

在 XML 输出中显示的检索集中的 UID 总数（默认值=20）。默认情况下，ESearch 仅在 XML 输出中包含前 20 个检索到的 UID。如果 **usehistory** 设置为 'y'，则检索集的其余部分将存储在历史服务器上；否则，这些 UID 将丢失。增加 **retmax** 可以使更多的检索到的 UID 包含在 XML 输出中，最多可以包含 10,000 条记录。

要从除 PubMed 以外的数据库中检索超过 10,000 个 UID，请提交多次 esearch 请求，同时增加 **retstart** 的值（参见应用程序 3）。对于 PubMed，ESearch 只能检索与查询匹配的前 10,000 条记录。要获取超过 10,000 条 PubMed 记录，请考虑使用包含附加逻辑的 `<EDirect>`，以便自动批量检索 PubMed 搜索结果，从而可以检索任意数量的记录。

#### rettype

检索类型。ESearch 允许的两个值是：“uilist”（默认），显示标准的 XML 输出，以及“count”，仅显示 `<Count>` 标签。

#### retmode

检索类型。确定返回输出的格式。ESearch XML 的默认值为'xml'，但也支持返回 JSON 格式的‘json’。

#### sort

指定用于对 ESearch 输出中的 UID 进行排序的方法。可用的值因数据库（**db**）而异，可以在 Entrez 搜索结果页面的显示设置菜单中找到。如果 **usehistory** 设置为 'y'，则 UID 将按照指定的排序顺序加载到历史服务器上，并按该顺序由 ESummary 或 EFetch 检索。示例值有“relevance”和“name”用于 Gene。用户应注意，**sort** 的默认值因数据库而异，并且 ESearch 用于特定数据库的默认值可能与 NCBI Web 搜索页面上使用的默认值不同。

PubMed 的** sort **值如下：

- *pub_date* – 按发表日期降序排序
- *Author* – 按第一作者升序排序
- *JournalName* – 按期刊名称升序排序
- *relevance* – 默认排序顺序（“最佳匹配”）在 Web PubMed 上

#### field

搜索字段。如果使用，整个搜索词将限于指定的 Entrez 字段。以下两个 URL 是等价的：

```
esearch.fcgi?db=pubmed&term=asthma&field=title

esearch.fcgi?db=pubmed&term=asthma[title]
```

#### idtype

指定序列数据库（nuccore、popset、protein）的标识符类型。默认情况下，ESearch 在其输出中返回 GI 号。如果 **idtype** 设置为“acc”，ESearch 将返回登录号。version 标识符，而不是 GI 号。

### 可选参数 – 日期

#### datetype

用于限制搜索的日期类型。允许的值因 Entrez 数据库而异，但常见的值有'mdat'（修改日期）、'pdat'（发表日期）和'edat'（Entrez 日期）。通常，一个 Entrez 数据库只有两个允许的 **datetype** 值。

#### reldate

当 **reldate** 设置为整数 *n* 时，搜索仅返回 **datetype** 在过去 *n* 天内指定的日期的项目。

#### mindate, maxdate

用于按 **datetype** 指定的日期范围限制搜索结果。这两个参数（**mindate, maxdate**）必须一起使用以指定任意日期范围。一般日期格式为 YYYY/MM/DD，允许的变体还有：YYYY，YYYY/MM。

### 示例

在 PubMed 中使用术语 *cancer* 搜索在过去 60 天内具有 Entrez 日期的摘要；检索前 100 个 PMID 和翻译；将结果发布到历史服务器并返回 **WebEnv** 和 **query_key**：

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=cancer&reldate=60&datetype=edat&retmax=100&usehistory=y**

在 PubMed 中搜索 PNAS 期刊，第 97 卷，并从列表中的第七个 PMID 开始检索六个 PMID：

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=PNAS[ta]+AND+97[vi]&retstart=6&retmax=6&tool=biomed3**

在 NLM 目录中搜索匹配术语 *obstetrics* 的期刊：

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=nlmcatalog&term=obstetrics+AND+ncbijournals[filter]**

在 PubMed Central 中搜索包含查询 *stem cells* 的免费全文文章：

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pmc&term=stem+cells+AND+free+fulltext[filter]**

在 Nucleotide 中搜索所有 tRNA：

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=nucleotide&term=biomol+trna[prop]**

在 Protein 中按分子量范围搜索：

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=protein&term=70000:90000[molecular+weight]**

## EPost

### 基本 URL

https://eutils.ncbi.nlm.nih.gov/entrez/eutils/epost.fcgi

### 功能

- 上传 UID 列表到 Entrez 历史服务器
- 将 UID 列表追加到附加到 Web 环境的现有 UID 列表集中

### 必需参数

#### db

包含输入列表中 UID 的数据库。该值必须是有效的 [Entrez 数据库名称](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter2/#chapter2.chapter2_table1)（默认=pubmed）。

#### id

UID 列表。可以提供单个 UID 或逗号分隔的 UID 列表。所有 UID 必须来自由 **db** 指定的数据库。对于 PubMed，在单个 URL 请求中最多只能包含 10,000 个 UID。对于其他数据库，没有指定的 UID 数量上限，但如果要发布超过约 200 个 UID，请使用 HTTP POST 方法进行请求。

对于序列数据库（nuccore、popset、protein），UID 列表可以是 GI 编号和登录号。version 标识符的混合列表。**注意：** 使用登录号。version 标识符时，会进行一个转换步骤，即使使用 POST 方法，大型标识符列表也可能会超时。因此，我们建议将这些类型的请求批量处理，每批不超过 500 个 UID，以避免从原始 POST 输入列表中仅检索部分记录。

```
epost.fcgi?db=pubmed&id=19393038,30242208,29453458
epost.fcgi?db=protein&id=15718680,NP_001098858.1,119703751
```

### 可选参数

#### WebEnv

Web 环境。如果提供此参数，则指定接收通过 post 发送的 UID 列表的 Web 环境。EPost 将创建一个与该 Web 环境相关的新查询键。通常，此 WebEnv 值是从先前的 ESearch、EPost 或 ELink 调用的输出中获得的。如果没有提供 **WebEnv** 参数，EPost 将创建一个新的 Web 环境并将 UID 列表发布到 **query_key** 1。

```
epost.fcgi?db=protein&id=15718680,157427902,119703751&WebEnv=<webenv string>
```

### 示例

将记录发布到 PubMed：

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/epost.fcgi?db=pubmed&id=11237011,12466850**

## ESummary

### 基本 URL

https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi

### 功能

- 返回输入 UID 列表的文档摘要（DocSums）
- 返回存储在 Entrez 历史服务器上的 UID 集合的 DocSums

### 必需参数

#### db

要检索 DocSums 的数据库。该值必须是有效的 [Entrez 数据库名称](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter2/#chapter2.chapter2_table1)（默认=pubmed）。

### 必需参数 – 仅在输入为 UID 列表时使用

#### id

UID 列表。可以提供单个 UID 或逗号分隔的 UID 列表。所有 UID 必须来自由 **db** 指定的数据库。对于 ESummary 传递的 UID 数量没有设定的上限，但如果要提供超过约 200 个 UID，请使用 HTTP POST 方法进行请求。

对于序列数据库（nuccore、popset、protein），UID 列表可以是 GI 编号和登录号。version 标识符的混合列表。

```
esummary.fcgi?db=pubmed&id=19393038,30242208,29453458
esummary.fcgi?db=protein&id=15718680,NP_001098858.1,119703751
```

### 必需参数 – 仅在输入来自 Entrez 历史服务器时使用

#### query_key

查询键。此整数指定附加到给定 Web 环境的 UID 列表中的哪个将用作 ESummary 的输入。查询键从先前的 ESearch、EPost 或 ELink 调用的输出中获得。**query_key** 参数必须与 **WebEnv** 一起使用。

#### WebEnv

Web 环境。此参数指定包含要提供给 ESummary 的 UID 列表的 Web 环境。通常，此 WebEnv 值是从先前的 ESearch、EPost 或 ELink 调用的输出中获得的。**WebEnv** 参数必须与 **query_key** 一起使用。

```
esummary.fcgi?db=protein&query_key=<key>&WebEnv=<webenv string>
```

### 可选参数 – 检索

#### retstart

要检索的第一个 DocSum 的顺序索引（默认=1，对应于整个集合的第一条记录）。此参数可与 **retmax** 一起使用，从输入集中下载任意子集的 DocSums。

#### retmax

从输入集中检索的 DocSums 总数，最多 10,000 个。如果总集合大于此最大值，可以在保持 **retmax** 不变的情况下迭代 **retstart** 的值，从而批量下载整个集合，每批大小为 **retmax**。

#### retmode

检索类型。确定返回输出的格式。ESummary XML 的默认值为‘xml’，但也支持返回 JSON 格式的‘json’。

#### version

用于指定 2.0 版本的 ESummary XML。唯一支持的值是‘2.0’。当存在时，ESummary 将返回版本 2.0 的 DocSum XML，该版本对于每个 Entrez 数据库都是唯一的，通常包含比默认 DocSum XML 更多的数据。

### 示例

PubMed：

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=11850928,11482001**

PubMed，2.0 版本 XML：

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=11850928,11482001&version=2.0**

蛋白质：

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=protein&id=28800982,28628843**

核苷酸：

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=nucleotide&id=28864546,28800981**

结构：

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=structure&id=19923,12120**

分类法：

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=taxonomy&id=9913,30521**

UniSTS：

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=unists&id=254085,254086**

## EFetch

### 基本 URL

https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi

### 功能

- 返回输入 UID 列表的格式化数据记录
- 返回存储在 Entrez 历史服务器上的 UID 集合的格式化数据记录

### 必需参数

#### db

要检索记录的数据库。该值必须是有效的 [Entrez 数据库名称](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter2/#chapter2.chapter2_table1)（默认=pubmed）。目前 EFetch 不支持所有的 Entrez 数据库。请参见第 2 章中的 [表 1](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter2/#chapter2.T._entrez_unique_identifiers_ui) 获取可用数据库的列表。

### 必需参数 – 仅在输入为 UID 列表时使用

#### id

UID 列表。可以提供单个 UID 或逗号分隔的 UID 列表。所有 UID 必须来自由 **db** 指定的数据库。对于 EFetch 传递的 UID 数量没有设定的上限，但如果要提供超过约 200 个 UID，请使用 HTTP POST 方法进行请求。

对于序列数据库（nuccore、popset、protein），UID 列表可以是 GI 编号和登录号。version 标识符的混合列表。

```
efetch.fcgi?db=pubmed&id=19393038,30242208,29453458
efetch.fcgi?db=protein&id=15718680,NP_001098858.1,119703751
```

*序列数据库的特别注意事项。*

NCBI 不再为越来越多的新序列记录分配 GI 编号。因此，这些记录没有在 Entrez 中编入索引，因此无法使用 ESearch 或 ESummary 检索，也没有可以通过 ELink 访问的 Entrez 链接。EFetch *可以* 通过在 **id** 参数中包括其登录号。version 标识符来检索这些记录。

### 必需参数 – 仅在输入来自 Entrez 历史服务器时使用

#### query_key

查询键。此整数指定附加到给定 Web 环境的 UID 列表中的哪个将用作 EFetch 的输入。查询键从先前的 ESearch、EPost 或 ELInk 调用的输出中获得。**query_key** 参数必须与 **WebEnv** 一起使用。

#### WebEnv

Web 环境。此参数指定包含要提供给 EFetch 的 UID 列表的 Web 环境。通常，此 WebEnv 值是从先前的 ESearch、EPost 或 ELink 调用的输出中获得的。**WebEnv** 参数必须与 **query_key** 一起使用。

```
efetch.fcgi?db=protein&query_key=<key>&WebEnv=<webenv string>
```

### 可选参数 – 检索

#### retmode

检索模式。此参数指定返回的记录的数据格式，例如纯文本、HTML 或 XML。请参见 [表 1](https://www.ncbi.nlm.nih.gov/books/NBK25499/table/chapter4.T._valid_values_of__retmode_and/?report=objectonly) 以获取每个数据库的允许值的完整列表。

[![表图标](https://www.ncbi.nlm.nih.gov/corehtml/pmc/css/bookshelf/2.26/img/table-icon.gif)](https://www.ncbi.nlm.nih.gov/books/NBK25499/table/chapter4.T._valid_values_of__retmode_and/?report=objectonly)

#### [表 1](https://www.ncbi.nlm.nih.gov/books/NBK25499/table/chapter4.T._valid_values_of__retmode_and/?report=objectonly)

– EFetch 的&retmode 和&rettype 的有效值（null = 空字符串）

#### rettype

检索类型。此参数指定返回的记录视图，例如 PubMed 的摘要或 MEDLINE，或蛋白质的 GenPept 或 FASTA。请参见 [表 1](https://www.ncbi.nlm.nih.gov/books/NBK25499/table/chapter4.T._valid_values_of__retmode_and/?report=objectonly) 以获取每个数据库的允许值的完整列表。

#### retstart

要检索的第一条记录的顺序索引（默认=0，对应于整个集合的第一条记录）。此参数可与 **retmax** 一起使用，从输入集中下载任意子集的记录。

#### retmax

从输入集中检索的记录总数，最多 10,000 条。对于大集合，可以在保持 **retmax** 不变的情况下迭代 **retstart** 的值，从而批量下载整个集合，每批大小为 **retmax**。

### 可选参数 – 序列数据库

#### strand

要检索的 DNA 链。可用值为“1”表示正链，“2”表示负链。

#### seq_start

要检索的第一个序列碱基。该值应为所需第一个碱基的整数坐标，“1”表示序列的第一个碱基。

#### seq_stop

要检索的最后一个序列碱基。该值应为所需最后一个碱基的整数坐标，“1”表示序列的第一个碱基。

#### complexity

要返回的数据内容。许多序列记录是更大数据结构或“blob”的一部分，**complexity** 参数决定了返回多少该 blob 的数据。例如，一个 mRNA 可能与其蛋白质产物一起存储。可用的值如下：

| complexity 值 | 每个请求的 GI 返回的数据 |
| :----------- | :--------------------- |
| 0            | 整个 blob               |
| 1            | 生物序列               |
| 2            | 最小的生物序列集       |
| 3            | 最小的核-蛋白质        |
| 4            | 最小的发布集           |

### 示例

**PubMed**

以文本摘要格式获取 PMID 17284678 和 9997：

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=17284678,9997&retmode=text&rettype=abstract**

获取 XML 格式的 PMID：

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=11748933,11700088&retmode=xml**

**PubMed Central**

获取 PubMed Central ID 212403 的 XML：

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pmc&id=212403**

**核苷酸/Nuccore**

获取 GI 21614549 正链的前 100 个碱基，格式为 FASTA：

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nuccore&id=21614549&strand=1&seq_start=1&seq_stop=100&rettype=fasta&retmode=text**

获取 GI 21614549 负链的前 100 个碱基，格式为 FASTA：

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nuccore&id=21614549&strand=2&seq_start=1&seq_stop=100&rettype=fasta&retmode=text**

获取 GI 21614549 的核-蛋白质对象：

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nuccore&id=21614549&complexity=3**

获取 GI 5 的完整 ASN.1 记录：

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nucleotide&id=5**

获取 GI 5 的 FASTA：

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nucleotide&id=5&rettype=fasta**

获取 GI 5 的 GenBank 平文件：

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nucleotide&id=5&rettype=gb**

获取 GI 5 的 GBSeqXML：

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nucleotide&id=5&rettype=gb&retmode=xml**

获取 GI 5 的 TinySeqXML：

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nucleotide&id=5&rettype=fasta&retmode=xml**

**Popset**

获取 Popset ID 12829836 的 GenPept 平文件：

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=popset&id=12829836&rettype=gp**

**蛋白质**

获取 GI 8 的 GenPept 平文件：

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=protein&id=8&rettype=gp**

获取 GI 8 的 GBSeqXML：

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=protein&id=8&rettype=gp&retmode=xml**

**序列**

获取一个转录本及其蛋白质产物的 FASTA（GIs 312836839 和 34577063）

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=sequences&id=312836839,34577063&rettype=fasta&retmode=text**

**基因**

获取 Gene ID 2 的完整 XML 记录：

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=gene&id=2&retmode=xml**

## ELink

### 基本 URL

https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi

### 功能

- 返回链接到输入 UID 集的 UID，无论是在相同还是不同的 Entrez 数据库中
- 返回与 Entrez 查询匹配的同一数据库中链接到其他 UID 的 UID
- 检查 UID 集在同一数据库中是否存在 Entrez 链接
- 列出 UID 的可用链接
- 列出一组 UID 的 LinkOut URL 和属性
- 列出一组 UID 的主要 LinkOut 提供者的超链接
- 创建到单个 UID 的主要 LinkOut 提供者的超链接

### 必需参数

#### db

要检索 UID 的数据库。该值必须是有效的 [Entrez 数据库名称](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter2/#chapter2.chapter2_table1)（默认=pubmed）。这是链接操作的目标数据库。

#### dbfrom

包含输入 UID 的数据库。该值必须是有效的 [Entrez 数据库名称](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter2/#chapter2.chapter2_table1)（默认=pubmed）。这是链接操作的源数据库。如果 **db** 和 **dbfrom** 设置为相同的数据库值，则 ELink 将在该数据库内返回计算邻居。请参见 [完整的 Entrez 链接列表](https://eutils.ncbi.nlm.nih.gov/entrez/query/static/entrezlinks.html) 了解可用的计算邻居。计算邻居的链接名称以 *dbname_dbname* 开头（例如：protein_protein，pcassay_pcassay_activityneighbor）。

#### cmd

ELink 命令模式。命令模式指定 ELink 将执行的功能。某些可选参数仅在某些 &cmd 值下工作（见下文）。

**cmd=neighbor（默认）**

ELink 返回链接到 **dbfrom** 中输入 UID 集的 **db** 中的一组 UID。

*示例：从蛋白质链接到基因*

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=protein&db=gene&id=15718680,157427902**

**cmd=neighbor_score**

ELink 返回与输入 UID 集相同数据库中的一组 UID 以及计算的相似度分数。

*示例：查找 PMID 20210808 的相关文章*

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pubmed&db=pubmed&id=20210808&cmd=neighbor_score**

**cmd=neighbor_history**

ELink 将输出 UID 发布到 Entrez 历史服务器，并返回与输出集位置对应的 **query_key** 和 **WebEnv**。

*示例：从蛋白质链接到基因并将结果发布到 Entrez 历史*

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=protein&db=gene&id=15718680,157427902&cmd=neighbor_history**

**cmd=acheck**

ELink 列出 UID 集的所有可用链接。

*示例：列出两个蛋白质 GI 的所有可能链接*

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=protein&id=15718680,157427902&cmd=acheck**

*示例：列出两个蛋白质 GI 到 PubMed 的所有可能链接*

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=protein&db=pubmed&id=15718680,157427902&cmd=acheck**

**cmd=ncheck**

ELink 检查一组 UID 在*同一数据库内*是否存在链接。这些链接等同于将 **db** 和 **dbfrom** 设置为相同的值。

*示例：检查两个 nuccore 序列是否具有“相关序列”链接。*

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=nuccore&id=21614549,219152114&cmd=ncheck**

**cmd=lcheck**

Elink 检查一组 UID 是否存在外部链接（LinkOuts）。

*示例：检查两个蛋白质序列是否有任何 LinkOut 提供者。*

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=protein&id=15718680,157427902&cmd=lcheck**

**cmd=llinks**

对于每个输入 UID，ELink 列出非图书馆 LinkOut 提供者的 URL 和属性。

*示例：列出两个 PubMed 摘要的非图书馆提供者的 LinkOut URL。*

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pubmed&id=19880848,19822630&cmd=llinks**

**cmd=llinkslib**

对于每个输入 UID，ELink 列出*所有* LinkOut 提供者（包括图书馆）的 URL 和属性。

*示例：列出两个 PubMed 摘要的所有 LinkOut URL。*

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pubmed&id=19880848,19822630&cmd=llinkslib**

**cmd=prlinks**

ELink 列出每个输入 UID 的主要 LinkOut 提供者，或如果 **retmode** 设置为 *ref*，则直接链接到 LinkOut 提供者的网站。

*示例：查找两个 PubMed 摘要的全文提供者链接。*

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pubmed&id=19880848,19822630&cmd=prlinks**

*示例：直接链接到提供者网站上的 PubMed 摘要全文。*

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pubmed&id=19880848&cmd=prlinks&retmode=ref**

### 必需参数 – 仅在输入为 UID 列表时使用

#### id

UID 列表。可以提供单个 UID 或逗号分隔的 UID 列表。所有 UID 必须来自由 **dbfrom** 指定的数据库。对于传递给 ELink 的 UID 数量没有设定的上限，但如果要提供超过约 200 个 UID，请使用 HTTP POST 方法进行请求。

*从蛋白质链接到基因。*

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=protein&db=gene&id=15718680,157427902,119703751**

*查找相关序列（从 nuccore 链接到 nuccore）。*

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=nuccore&db=nuccore&id=34577062**

如果提供了多个 **id** 参数，ELink 将为每个 **id** 参数指定的 UID 集执行单独的链接操作。这有效地完成了“一对一”链接并保留了输入和输出 UID 之间的连接。

*查找蛋白质到基因的一对一链接。*

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=protein&db=gene&id=15718680&id=157427902&id=119703751**

对于序列数据库（nuccore、popset、protein），UID 列表可以是 GI 编号和登录号。version 标识符的混合列表。

*查找蛋白质到基因的一对一链接。*

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=protein&db=gene&id=15718680&id=NP_001098858.1&id=119703751**

### 必需参数 – 仅在输入来自 Entrez 历史服务器时使用

#### query_key

查询键。此整数指定附加到给定 Web 环境的 UID 列表中的哪个将用作 ELink 的输入。查询键从先前的 ESearch、EPost 或 ELink 调用的输出中获得。**query_key** 参数必须与 **WebEnv** 一起使用。

#### WebEnv

Web 环境。此参数指定包含要提供给 ELink 的 UID 列表的 Web 环境。通常，此 WebEnv 值是从先前的 ESearch、EPost 或 ELink 调用的输出中获得的。**WebEnv** 参数必须与 **query_key** 一起使用。

```
从蛋白质链接到基因：
elink.fcgi?dbfrom=protein&db=gene&query_key=<key>&WebEnv=<webenv string>

查找相关序列（从蛋白质链接到蛋白质）：
elink.fcgi?dbfrom=protein&db=protein&query_key=<key>&WebEnv=<webenv string>
```

### 可选参数 – 检索

#### retmode

检索类型。确定返回输出的格式。ELink XML 的默认值为‘xml’，但也支持返回 JSON 格式的‘json’。

#### idtype

指定返回序列数据库标识符的类型（nuccore、popset、protein）。默认情况下，ELink 在其输出中返回 GI 编号。如果 **idtype** 设置为‘acc’，ELink 将返回登录号。version 标识符而不是 GI 编号。

### 可选参数 – 限制链接输出集

#### linkname

要检索的 Entrez 链接的名称。Entrez 中的每个链接都有一个形式为 *dbfrom_db_subset* 的名称。

*subset* 的值取决于 *dbfrom* 和 *db* 的值。许多 *dbfrom/db* 组合没有 *subset* 值。请参见 [Entrez 链接列表](https://eutils.ncbi.nlm.nih.gov/entrez/query/static/entrezlinks.html) 了解所有可用的链接名称。当使用 **linkname** 时，只会检索具有该名称的链接。

**linkname** 参数仅在 **cmd** 设置为 *neighbor* 或 *neighbor_history* 时起作用。

*查找基因到 snp 的所有链接。*

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=gene&db=snp&id=93986**

*查找与基因相关的带有基因型数据的 snp。*

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=gene&db=snp&id=93986&linkname=gene_snp_genegenotype**

#### term

用于限制链接 UID 输出集的 Entrez 查询。**term** 参数中的查询将在链接操作后应用，并且只有匹配查询的 UID 将由 ELink 返回。**term** 参数仅在 **db** 和 **dbfrom** 设置为相同数据库值时起作用。

*查找 PMID 的所有相关文章。*

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pubmed&db=pubmed&id=19879512**

*查找发布于 2008 年的 PMID 相关评论文章。*

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pubmed&db=pubmed&id=19879512&term=review%5Bfilter%5D+AND+2008%5Bpdat%5Dh**

#### holding

LinkOut 提供者的名称。仅返回指定 **holding** 的 LinkOut 提供者的 URL。提供给 **holding** 的值应为当 **cmd** 设置为 *llinks* 或 *llinkslib* 时从 ELink XML 输出中的 `<NameAbbr>` 标签找到的 LinkOut 提供者名称的缩写。**holding** 参数仅在 **cmd** 设置为 *llinks* 或 *llinkslib* 时起作用。

*查找 PMID 的所有 LinkOut 提供者的信息。*

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pubmed&cmd=llinkslib&id=16210666**

*查找 clinicaltrials.gov 提供的 PMID 信息。*

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pubmed&cmd=llinkslib&id=16210666&holding=CTgov**

### 可选参数 – 日期

这些参数仅在 **cmd** 设置为 *neighbor* 或 *neighbor_history* 并且 **dbfrom** 为 *pubmed* 时起作用。

#### datetype

用于限制链接操作的日期类型。允许的值因 Entrez 数据库而异，但常见的值是 'mdat'（修改日期）、'pdat'（出版日期）和 'edat'（Entrez 日期）。通常，Entrez 数据库只有两个允许的 **datetype** 值。

#### reldate

当 **reldate** 设置为整数 *n* 时，ELink 只返回具有在过去 *n* 天内由 **datetype** 指定的日期的项目。

#### mindate, maxdate

用于按由 **datetype** 指定的日期范围限制链接操作的日期范围。这两个参数（**mindate, maxdate**）必须一起使用，以指定任意日期范围。一般日期格式为 YYYY/MM/DD，这些变体也是允许的：YYYY，YYYY/MM。

## EGQuery

### 基本 URL

https://eutils.ncbi.nlm.nih.gov/entrez/eutils/egquery.fcgi

### 功能

通过单个文本查询提供在所有 Entrez 数据库中检索到的记录数。

### 必需参数

#### term

Entrez 文本查询。所有特殊字符必须进行 URL 编码。空格可以用“+”号替换。对于非常长的查询（超过几百个字符长），请考虑使用 HTTP POST 调用。有关搜索字段描述和标签的信息，请参见 [PubMed](https://www.ncbi.nlm.nih.gov/books/n/helppubmed/pubmedhelp/#pubmedhelp.Search_Field_Descrip) 或 [Entrez](https://www.ncbi.nlm.nih.gov/books/n/helpentrez/EntrezHelp/) 帮助。搜索字段和标签是数据库特定的。

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/egquery.fcgi?term=asthma**

## ESpell

### 基本 URL

https://eutils.ncbi.nlm.nih.gov/entrez/eutils/espell.fcgi

### 功能

为给定数据库中的单个文本查询提供拼写建议。

### 必需参数

#### db

要搜索的数据库。该值必须是有效的 [Entrez 数据库名称](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter2/#chapter2.chapter2_table1)（默认=pubmed）。

#### term

Entrez 文本查询。所有特殊字符必须进行 URL 编码。空格可以用“+”号替换。对于非常长的查询（超过几百个字符长），请考虑使用 HTTP POST 调用。有关搜索字段描述和标签的信息，请参见 [PubMed](https://www.ncbi.nlm.nih.gov/books/n/helppubmed/pubmedhelp/#pubmedhelp.Search_Field_Descrip) 或 [Entrez](https://www.ncbi.nlm.nih.gov/books/n/helpentrez/EntrezHelp/) 帮助。搜索字段和标签是数据库特定的。

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/espell.fcgi?db=pubmed&term=asthmaa+OR+alergies**

## ECitMatch

### 基本 URL

https://eutils.ncbi.nlm.nih.gov/entrez/eutils/ecitmatch.cgi

### 功能

检索与一组输入引用字符串对应的 PubMed ID（PMID）。

### 必需参数

#### db

要搜索的数据库。唯一支持的值是‘pubmed’。

#### rettype

检索类型。唯一支持的值是‘xml’。

#### bdata

引用字符串。每个输入引用必须由以下格式的引用字符串表示：

journal_title|year|volume|first_page|author_name|your_key|

可以通过换行符字符（%0D）分隔字符串提供多个引用字符串。*your_key* 值是用户提供的任意标签，可作为引用的本地标识符，并将包含在输出中。请注意，所有空格必须用‘+’符号替换，引用字符串应以最终的竖线‘|’结尾。

**https://eutils.ncbi.nlm.nih.gov/entrez/eutils/ecitmatch.cgi?db=pubmed&retmode=xml&bdata=proc+natl+acad+sci+u+s+a|1991|88|3248|mann+bj|Art1|%0Dscience|1987|235|182|palmenberg+ac|Art2|**

## 发布说明

### EFetch; ELink JSON 输出：2015 年 6 月 24 日

- EFetch 现在支持 ClinVar 和 GTR
- ELink 现在提供 JSON 格式的输出

### ESearch &sort; JSON 输出格式：2014 年 2 月 14 日

- ESearch 现在提供支持的 **sort** 参数
- EInfo、ESearch 和 ESummary 现在提供 JSON 格式的输出数据

### ECitMatch, EInfo 2.0 版，EFetch：2013 年 8 月 9 日

- ECitMatch 是一个新的 E-utility，作为 PubMed 批量引用匹配器的 API
- EInfo 有更新的 XML 输出，包括两个新字段：`<IsTruncatable>` 和 `<IsRangeable>`
- EFetch 现在支持 BioProject 数据库

### EFetch 2.0 版。目标发布日期：2012 年 2 月 15 日

- EFetch 现在支持以下数据库：biosample、biosystems 和 sra
- EFetch 现在为所有支持的数据库定义了&retmode 和&rettype 的默认值（请参见 [表 1](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter4/#chapter4.T._valid_values_of__retmode_and) 了解这些参数的所有支持值）
- EFetch 不再支持&retmode=html；包含&retmode=html 的请求将返回使用指定数据库（&db）的默认&retmode 值的数据
- 包含&rettype=docsum 的 EFetch 请求将返回等同于 ESummary 输出的 XML 数据

### 新 Genome 数据库发布：2011 年 11 月 9 日

- Entrez Genome 已完全重新设计，数据库记录现在对应一个物种而不是单个染色体序列。请参见 https://www.ncbi.nlm.nih.gov/About/news/17Nov2011.html 了解更改的详细信息
- 旧的 Genome ID 不再有效。NCBI FTP 站点上提供了一个文件，将旧的 Genome ID 映射到 Nucleotide GI：[ftp.ncbi.nih.gov/genomes/old_genomeID2nucGI](https://ftp.ncbi.nlm.nih.gov/genomes/old_genomeID2nucGI)
- EFetch 不再支持从 Genome（db=genome）检索
- Genome 的 ESummary XML 已重新格式化，以反映新的数据模型
- 要查看新 Genome 数据库支持的新搜索字段和链接，请参见 https://eutils.ncbi.nlm.nih.gov/entrez/eutils/einfo.fcgi?db=genome

### ESummary 2.0 版。2011 年 11 月 4 日

- ESummary 现在支持新的替代 XML 展示形式，用于 Entrez 文档摘要（DocSums）。新的 XML 对于每个 Entrez 数据库是独特的，通常包含比原始 DocSum XML 更多的记录数据
- 目前没有计划停止使用原始 DocSum XML，因此开发人员可以继续使用这种展示形式，它将保持默认
- 当 URL 中包含&version=2.0 时，将返回 2.0 版 XML

## 示例程序

请参见 [第 1 章](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter1/#chapter1.Demonstration_Programs) 了解示例 Perl 脚本。

## 更多信息

请参见 [第 1 章](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter1/#chapter1.For_More_Information_8) 了解有关 E-utilities 的更多信息。