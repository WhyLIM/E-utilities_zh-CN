---
order: 2
---

# E-utilities 概述

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
> 创建时间：2009 年 5 月 26 日；最后更新：2022 年 11 月 17 日。
>
> *预计阅读时间：11 分钟*

## 介绍

Entrez 编程实用工具（E-utilities）是一组九个服务器端程序，它们提供了一个稳定的接口，用于访问国家生物技术信息中心（NCBI）的 Entrez 查询和数据库系统。E-utilities 使用固定的 URL 语法，将一组标准输入参数转换为所需的 NCBI 软件组件的值，以便搜索和检索请求的数据。因此，E-utilities 是 Entrez 系统的结构化接口，该系统目前包括 38 个数据库，涵盖各种生物医学数据，包括核苷酸和蛋白质序列、基因记录、三维分子结构和生物医学文献。

要访问这些数据，一段软件首先将 E-utility URL 发送到 NCBI，然后检索该请求的结果，并根据需要处理数据。因此，软件可以使用任何能够发送 URL 到 E-utilities 服务器并解释 XML 响应的计算机语言，例如 Perl、Python、Java 和 C++。将 E-utilities 组件结合在这些应用程序中形成定制的数据管道是数据处理的强大方法。

本章首先描述了八个 E-utilities 的基本功能和使用方法，然后提供了基本使用指南和要求，最后讨论了 E-utilities 在 Entrez 系统中的作用。

## 使用指南和要求

### 使用 E-utility URL

所有 E-utility 请求应指向以下字符串开头的 URL：

```
https://eutils.ncbi.nlm.nih.gov/entrez/eutils/
```

这些 URL 将请求定向到专门用于 E-utilities 的服务器，这些服务器经过优化，可为用户提供最佳性能。

### E-utility URL 请求的频率、时间和注册

为了不使 E-utility 服务器超载，NCBI 建议用户每秒发布不超过三个 URL 请求，并将大量作业限制在周末或工作日晚上 9:00 至早上 5:00（东部时间）之间。未能遵守此政策可能导致 IP 地址被阻止访问 NCBI。如果 NCBI 阻止一个 IP 地址，除非访问 E-utilities 的软件开发者向 NCBI 注册 **tool** 和 **email** 参数值，否则服务不会恢复。**tool** 的值应为不包含空格的字符串，用于唯一标识生成请求的软件。**email** 的值应为软件开发者的完整有效电子邮件地址，而不是第三方终端用户的地址。**email** 的值仅用于在 NCBI 观察到违反我们政策的请求时联系开发者，并且我们将在阻止访问之前尝试联系。此外，开发者可以请求将 **email** 的值添加到 E-utility 邮件列表中，该列表提供有关软件更新、已知错误和其他影响 E-utilities 的政策更改的公告。要注册 **tool** 和 **email** 值，只需发送电子邮件至 [vog.hin.mln.ibcn@seitilitue](mailto:dev@null)，包括所需的值以及开发者或创建软件的组织的名称。一旦 NCBI 与开发者建立通信，接收到 **tool** 和 **email** 值并验证 **email** 中的电子邮件地址，阻止将被解除。一旦 **tool** 和 **email** 值注册，所有来自该软件包的后续 E-utility 请求应包含这两个值。请注意，仅在请求中提供 **tool** 和 **email** 值不足以遵守此政策；这些值必须向 NCBI 注册。任何缺少已注册 **tool** 和 **email** 值并违反上述使用政策的 IP 的请求可能会被阻止。软件开发者可以随时注册 **tool** 和 **email** 值，并鼓励这样做。

### API 密钥

自 2018 年 12 月 1 日起，NCBI 提供 API 密钥，提供对 E-utilities 的增强访问支持。没有 API 密钥的情况下，任何站点（IP 地址）每秒发送超过 3 个请求到 E-utilities 将收到错误消息。通过包含 API 密钥，一个站点默认每秒可以发送最多 10 个请求。可以通过请求获得更高的速率（[vog.hin.mln.ibcn@seitilitue](mailto:dev@null)）。用户现在可以从其 NCBI 账户的设置页面获取 API 密钥（要创建账户，请访问 [http://www.ncbi.nlm.nih.gov/account/](https://www.ncbi.nlm.nih.gov/account/)）。创建密钥后，用户应通过将其分配给* api_key *参数来包含在每个 E-utility 请求中。

```
包括 API 密钥的示例请求：
esummary.fcgi?db=pubmed&id=123456&api_key=ABCDE12345

超出速率时的示例错误消息：
{"error":"API rate limit exceeded","count":"11"}
```

每个 NCBI 账户仅允许一个 API 密钥；然而，用户可以随时请求新密钥。这样的请求将使与该 NCBI 账户关联的任何现有 API 密钥失效。

### 最小化请求数量

如果任务需要搜索和/或下载大量记录，则使用 Entrez 历史记录上传和/或批量检索这些记录要比为每条记录使用单独请求更高效。请参阅 [第 3 章的应用 3](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter3/#chapter3.Application_3_Retrieving_large) 以获取示例。可以使用单个 EPost 请求上传成千上万的 ID，并使用一个 EFetch 请求下载几百条记录。

### 免责声明和版权问题

如果您在软件中使用 E-utilities，NCBI 的免责声明和版权声明（https://www.ncbi.nlm.nih.gov/About/disclaimer.html）必须对您的产品用户显而易见。请注意，PubMed 中的摘要可能包含受美国和外国版权法保护的材料。所有复制、再分发或商业使用此信息的人员应遵守版权持有人提出的条款和条件。传输或复制超出版权法定义的合理使用（PDF）范围的受保护项目需要获得版权所有者的书面许可。NLM 不提供有关分发受版权保护材料的法律建议。请咨询您的法律顾问。如果您希望对 PubMed 数据进行大规模数据挖掘项目，可以在 https://www.nlm.nih.gov/databases/download/pubmed_medline.html 下载本地副本。

### 处理 URL 中的特殊字符

构建 E-utilities 的 URL 时，请对所有参数使用小写字符，除了&WebEnv。E-utility URL 中的参数顺序没有要求，空值或不适当的参数通常会被忽略。避免在 URL 中使用空格，特别是在查询中。如果需要空格，请使用加号（+）代替空格：

```
错误：&id=352, 25125, 234
正确：&id=352,25125,234

错误：&term=biomol mrna[properties] AND mouse[organism]
正确：&term=biomol+mrna[properties]+AND+mouse[organism]
```

其他特殊字符，如引号（“）或#符号（用于引用历史服务器上的查询键），应使用其 URL 编码（“的%22；#的%23）。

```
错误：&term=#2+AND+"gene in genomic"[properties]
正确：&term=%232+AND+%22gene+in+genomic%22[properties]
```

## 九个 E-utilities 简介

### EInfo（数据库统计）

*eutils.ncbi.nlm.nih.gov/entrez/eutils/einfo.fcgi*

提供每个字段中索引的记录数量、数据库最后更新的日期以及从数据库到其他 Entrez 数据库的可用链接。

### ESearch（文本搜索）

*eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi*

响应给定数据库中的文本查询，返回匹配的 UID 列表（供以后在 ESummary、EFetch 或 ELink 中使用），以及查询的术语翻译。

### EPost（UID 上传）

*eutils.ncbi.nlm.nih.gov/entrez/eutils/epost.fcgi*

接受来自给定数据库的 UID 列表，将该集合存储在历史服务器上，并响应上传的数据集的查询键和网络环境。

### ESummary（文档摘要下载）

*eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi*

响应给定数据库中的 UID 列表，返回相应的文档摘要。

### EFetch（数据记录下载）

*eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi*

响应给定数据库中的 UID 列表，返回指定格式的数据记录。

### ELink（Entrez 链接）

*eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi*

响应给定数据库中的 UID 列表，返回同一数据库中的相关 UID 列表（及相关性得分），或另一个 Entrez 数据库中的链接 UID 列表；检查一个或多个 UID 列表中指定链接的存在；创建到特定 UID 和数据库的主要 LinkOut 提供者的超链接，或列出多个 UID 的 LinkOut URL 和属性。

### EGQuery（全局查询）

*eutils.ncbi.nlm.nih.gov/entrez/eutils/egquery.fcgi*

响应文本查询，返回在每个 Entrez 数据库中匹配查询的记录数。

### ESpell（拼写建议）

*eutils.ncbi.nlm.nih.gov/entrez/eutils/espell.fcgi*

检索给定数据库中文本查询的拼写建议。

### ECitMatch（PubMed 中的批量引文搜索）

*eutils.ncbi.nlm.nih.gov/entrez/eutils/ecitmatch.cgi*

检索与一组输入引文字符串相对应的 PubMed ID（PMID）。

## 理解 E-utilities 在 Entrez 中的作用

### E-utilities 访问 Entrez 数据库

E-utilities 访问 Entrez 系统的核心搜索和检索引擎，因此只能检索已在 Entrez 中的数据。尽管 NCBI 的大部分数据都在 Entrez 中，但也有一些数据集存在于 Entrez 系统之外。在使用 E-utilities 开始项目之前，请检查所需数据是否可以在 Entrez 数据库中找到。

### Entrez 系统使用 UID 标识数据库记录

每个 Entrez 数据库通过一个称为 UID（唯一标识符）的整数 ID 引用其数据记录。UID 的示例包括核苷酸和蛋白质的 GI 号、PubMed 的 PMID 或结构的 MMDB-ID。E-utilities 使用 UID 进行数据输入和输出，因此通常尤其对于高级数据管道，在使用 E-utilities 开始项目之前，了解如何找到所需数据关联的 UID 是至关重要的。

请参阅 [表 1](https://www.ncbi.nlm.nih.gov/books/NBK25497/table/chapter2.T._entrez_unique_identifiers_ui/?report=objectonly) 以获取 Entrez 中 UID 的完整列表。

[![表格图标](https://www.ncbi.nlm.nih.gov/corehtml/pmc/css/bookshelf/2.26/img/table-icon.gif)](https://www.ncbi.nlm.nih.gov/books/NBK25497/table/chapter2.T._entrez_unique_identifiers_ui/?report=objectonly)

#### [表 1](https://www.ncbi.nlm.nih.gov/books/NBK25497/table/chapter2.T._entrez_unique_identifiers_ui/?report=objectonly)

– 选定数据库的 Entrez 唯一标识符（UID）

### 使用 Accession.Version 标识符访问序列记录

NCBI 现在使用 accession.version 标识符而不是 GI 号（UID）作为核苷酸和蛋白质序列记录的主要标识符（包括 nuccore、nucest、nucgss、popset 和蛋白质数据库中的记录）。即便如此，E-utilities 继续提供使用 GI 号或 accession.version 标识符访问这些记录。接受 UID 作为输入的 E-utilities 也将接受 accession.version 标识符（针对上述序列数据库）。输出 UID 的 E-utilities 可以通过设置&idtype 参数为“acc”来输出 accession.version 标识符。最后，EFetch 可以通过其 accession.version 标识符检索任何序列记录，包括没有 GI 号的序列。请参阅 [第 4 章](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter4/) 了解每个 E-utility 如何处理 accession.version 标识符的更多详细信息。

### Entrez 核心引擎：EGQuery、ESearch 和 ESummary

Entrez 的核心是一个引擎，为任何 Entrez 数据库执行两项基本任务：1）汇总匹配文本查询的 UID 列表，2）检索每个 UID 的简要摘要记录，称为文档摘要（DocSum）。ESearch 和 ESummary 执行了 Entrez 引擎的这两项基本任务。ESearch 返回给定 Entrez 数据库中匹配文本查询的 UID 列表，而 ESummary 返回匹配输入 UID 列表的 DocSums。在网页 Entrez 中进行的文本搜索相当于 ESearch-ESummary。EGQuery 是 ESearch 的全局版本，可同时搜索所有 Entrez 数据库。由于这三个 E-utilities 执行了 Entrez 的两个核心功能，它们适用于所有 Entrez 数据库。

```
egquery.fcgi?term=query
esearch.fcgi?db=database&term=query
esummary.fcgi?db=database&id=uid1,uid2,uid3,...
```

### Entrez 查询的语法和初步解析

输入 Entrez 系统的文本搜索字符串将转换为以下格式的 Entrez 查询：

term1[field1] **Op** term2[field2] **Op** term3[field3] **Op** ...

其中术语是搜索术语，每个术语都限定在方括号中的特定 Entrez 字段，并使用三种布尔运算符之一组合：Op = AND、OR 或 NOT。这些布尔运算符必须全部用大写字母书写。

示例：human[organism] AND topoisomerase[protein name]

Entrez 首先将查询拆分为一系列最初由空格分隔的项目；因此，关键是术语和布尔运算符之间用空格分隔。如果查询仅由 UID 号（唯一标识符）或登录号列表组成，Entrez 系统将简单地返回相应的记录，不进行进一步解析。如果查询包含任何布尔运算符（AND、OR 或 NOT），则查询将拆分为由这些运算符分隔的术语，然后分别解析每个术语。这些搜索结果然后根据布尔运算符组合。

有关如何搜索 Entrez 的完整说明，请参阅 [Entrez 帮助文档](https://www.ncbi.nlm.nih.gov/books/n/helpentrez/EntrezHelp/)。更多信息请参阅 [Entrez 帮助](https://www.ncbi.nlm.nih.gov/books/n/helpentrez/)。

### Entrez 数据库：EInfo、EFetch 和 ELink

NCBI Entrez 系统目前包含 38 个数据库。EInfo 提供有关每个数据库的详细信息，包括数据库中的索引字段列表和与其他 Entrez 数据库的可用链接。

```
einfo.fcgi?db=database
```

每个 Entrez 数据库包括对原始数据记录的两个主要增强功能：1）生成适合给定数据库的各种显示格式的软件，2）与其他 Entrez 数据库中的记录链接，表现为关联 UID 列表。显示格式功能由 EFetch 执行，它为输入 UID 列表生成格式化输出。例如，EFetch 可以从 Entrez PubMed 生成摘要或从 Entrez Protein 生成 FASTA 格式。EFetch 尚未支持所有 Entrez 数据库；请参阅 [EFetch 文档](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter4/#chapter4.EFetch) 以获取详细信息。

```
efetch.fcgi?db=database&id=uid1,uid2,uid3&rettype=report_type&retmode=
data_mode
```

链接功能由 ELink 执行，它生成一个指定 Entrez 数据库中的 UID 列表，这些 UID 与同一或另一个数据库中的输入 UID 集相关联。例如，ELink 可以查找与 Entrez Nucleotide 记录相关联的 Entrez SNP 记录，或与 Entrez Protein 记录相关联的 Entrez Domain 记录。

```
elink.fcgi?dbfrom=initial_databasedb=target_database&id=uid1,uid2,uid3
```

### 使用 Entrez 历史服务器

Entrez 系统的一个强大功能是可以在服务器上临时存储检索到的 UID 集，以便随后将它们组合或作为其他 E-utility 调用的输入。Entrez 历史服务器提供此服务，可在 Web 上通过 Entrez 搜索页面上的预览/索引或历史标签访问。每个 E-utility 也可以使用历史

服务器，它为每个 UID 集分配一个称为查询键（&query_key）的整数标签和一个称为 Web 环境（&WebEnv）的编码 cookie 字符串。EPost 允许任何 UID 列表上传到历史服务器并返回查询键和 Web 环境。ESearch 也可以将其输出 UID 集发布到历史服务器，但仅当&usehistory 参数设置为“y”时。ELink 也可以将其输出发布到历史服务器，如果&cmd 设置为“neighbor_history”。然后可以在 ESummary、EFetch 和 ELink 中使用来自 EPost 或 ESearch 的查询键和 Web 环境代替 UID 列表。

在 Entrez 中，一个 UID 集由三个参数表示：

```
&db = database; &query_key = query key; &WebEnv = web environment
```

生成 Web 环境和查询键的上传步骤

```
esearch.fcgi?db=database&term=query&usehistory=y

epost.fcgi?db=database&id=uid1,uid2,uid3,...

elink.fcgi?dbfrom=source_db&db=destination_db&cmd=neighbor_history&id=uid1,uid2,...
```

使用 Web 环境和查询键的下载步骤

```
esummary.fcgi?db=database&WebEnv=webenv&query_key=key

efetch.fcgi?db=database&WebEnv=webenv&query_key=key&rettype=report_type&retmode=data_mode
```

使用 Web 环境和查询键的链接步骤

```
elink.fcgi?dbfrom=initial_databasedb=target_database&WebEnv=webenv&query_key=key
```

在&term 参数中使用 Web 环境和查询键的搜索步骤（前面加#，编码为%23）

```
esearch.fcgi?db=database&term=%23key+AND+query&WebEnv=webenv&usehistory=y
```

### 在历史服务器上生成多个数据集

历史服务器上的每个 Web 环境可以与任意数量的查询键关联。这允许使用布尔运算符 AND、OR 和 NOT 或与另一个 Entrez 查询组合不同的数据集。重要的是要记住，要组合两个数据集（查询键），它们必须与同一个 Web 环境关联。默认情况下，连续的 E-utility 调用生成不与同一 Web 环境关联的查询键，因此要克服这一点，初始调用后的每个 E-utility 调用必须将&WebEnv 参数设置为预先存在的 Web 环境的值。

默认行为：这两个 URL…

```
URL 1: epost.fcgi?db=database&id=uid1,uid2,uid3
URL 2: esearch.fcgi?db=database&term=query&usehistory=y
```

将生成两个与不同 Web 环境关联的历史集：

```
URL   WebEnv     query_key        UIDs
1      web1          1        uid1,uid2,uid3
2      web2          1        uids matching query
```

期望行为：这两个 URL…

```
URL 1: epost.fcgi?db=database&id=uid1,uid2,uid3
（从 URL 1 的输出中提取 web1）
URL 2: esearch.fcgi?db=database&term=query&usehistory=y&WebEnv=web1
```

将生成两个与相同（新）Web 环境关联的集合：

```
URL   WebEnv      query_key        UIDs
1      web2          1        uid1,uid2,uid3
2      web2          2        uids matching query
```

## 结合 E-utility 调用创建 Entrez 应用程序

E-utilities 在单个 URL 中使用时非常有用；然而，当将连续的 E-utility URL 结合起来创建数据管道时，它们的全部潜力得以实现。在这些管道中使用时，Entrez 历史服务器通过允许在连续的 E-utility 调用之间轻松传输数据，简化了复杂的检索任务。下面列出了通过结合 E-utilities 生成的多个管道示例，箭头表示将 db、WebEnv 和 query_key 值从一个 E-utility 传递到另一个 E-utility。这些及相关的管道在第 3 章中有详细讨论。

### 基本管道

#### 检索匹配 Entrez 查询的数据记录

[ESearch → ESummary](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter3/#chapter3.ESearch__ESummaryEFetch)

[ESearch → EFetch](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter3/#chapter3.ESearch__ESummaryEFetch)

#### 检索匹配 UID 列表的数据记录

[EPost → ESummary](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter3/#chapter3.EPost__ESummaryEFetch)

[EPost → EFetch](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter3/#chapter3.EPost__ESummaryEFetch)

#### 查找链接到一组记录的 UID

[ESearch → ELink](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter3/#chapter3.ESearch__ELink__ESummaryEFetch)

[EPost → ELink](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter3/#chapter3.EPost__ELink__ESummaryEFetch)

#### 使用 Entrez 查询限制记录集

[EPost → ESearch](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter3/#chapter3.EPost__ESearch)

[ELink → ESearch](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter3/#chapter3.ELink__ESearch)

### 高级管道

#### 检索与数据库 A 中匹配 Entrez 查询的记录相关联的数据库 B 中的数据记录

[ESearch → ELink → ESummary](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter3/#chapter3.ESearch__ELink__ESummaryEFetch)

[ESearch → ELink → EFetch](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter3/#chapter3.ESearch__ELink__ESummaryEFetch)

#### 从由 Entrez 查询定义的 ID 列表子集中检索数据记录

[EPost → ESearch → ESummary](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter3/#chapter3.EPost__ESearch)

[EPost → ESearch → EFetch](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter3/#chapter3.EPost__ESearch)

#### 从链接到数据库 A 中的 UID 列表的较大记录集中检索由 Entrez 查询定义的数据记录集

[EPost → ELink → ESearch → ESummary](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter3/#chapter3.ELink__ESearch)

[EPost → ELink → ESearch → EFetch](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter3/#chapter3.ELink__ESearch)

## 演示程序

请参阅 [第 1 章](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter1/#chapter1.Demonstration_Programs) 中的 Perl 脚本示例。

## 更多信息

请参阅 [第 1 章](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter1/#chapter1.For_More_Information_8) 以获取有关 E-utilities 的更多信息。