---
order: 6
---

# Entrez Direct：在 Unix 命令行上使用 E-utilities

> Jonathan Kans 博士
>
> [作者信息和所属机构](https://www.ncbi.nlm.nih.gov/books/NBK179288/#__NBK179288_ai__)
>
> **作者**
>
> Jonathan Kans 博士！[通讯作者](https://www.ncbi.nlm.nih.gov/corehtml/pmc/pmcgifs/corrauth.gif)1.
>
> **所属机构**
>
> 1 NCBI
>
> 电子邮件：[vog.hin.mln.ibcn@snak](mailto:dev@null)
>
> ![通讯作者](https://www.ncbi.nlm.nih.gov/corehtml/pmc/pmcgifs/corrauth.gif) 通讯作者。
>
> 创建日期：2013 年 4 月 23 日；最后更新日期：2024 年 5 月 9 日。
>
> *估计阅读时间：1 小时*

## 入门指南

### 介绍

Entrez Direct（EDirect）提供了从 Unix 终端窗口访问 NCBI 互联数据库（出版物、序列、结构、基因、变异、表达等）的方法。搜索术语作为命令行参数输入。通过使用 Unix 管道将各个操作连接起来构建多步查询。然后可以以多种格式检索选定的记录。

### 安装

EDirect 可以在 Unix 和 Macintosh 计算机上运行，并且可以在 Windows PC 上的 Cygwin Unix 仿真环境中运行。要安装 EDirect 软件，请打开终端窗口并执行以下两个命令之一：

```bash
sh -c "$(curl -fsSL https://ftp.ncbi.nlm.nih.gov/entrez/entrezdirect/install-edirect.sh)"

sh -c "$(wget -q https://ftp.ncbi.nlm.nih.gov/entrez/entrezdirect/install-edirect.sh -O -)"
```

这将下载一些脚本和几个预编译程序到用户的主目录中的"edirect"文件夹中。然后可能会打印出一个额外的命令，用于在用户的配置文件中更新 PATH 环境变量。编辑说明可能如下所示：

```bash
echo "export PATH=\$HOME/edirect:\$PATH" >> $HOME/.bash_profile
```

为了方便，安装过程结束时会提示是否运行 PATH 更新命令。如果您希望运行它，请回答“y”并按回车键。如果 PATH 已经设置正确，或者您更喜欢手动进行编辑更改，只需按回车键。

安装完成后，运行以下命令以设置当前终端会话的 PATH：

```bash
export PATH=${HOME}/edirect:${PATH}
```

### 快速开始

edirect 文件夹中包含的 **readme.pdf** 文件包含本文件的高度简略版。它旨在向新用户传达最重要的要点，同时仍然提供最基本的必要细节。它还涵盖了几个 Entrez 生物数据库中的微妙问题，展示了外部数据源的集成，并简要介绍了脚本编写和编程。

完整的文档对基础主题进行了更深入的探索，特别是在复杂对象部分和按 Entrez 数据库组织的附加示例网页中。该文档还介绍了其他值得注意的主题，如标识符查找和序列坐标转换，并更详细地讨论了自动化。

### 编程访问

EDirect 通过 Entrez 编程实用工具接口连接到 Entrez。它支持通过索引术语搜索，查找预计算的邻居或链接，通过日期或类别过滤结果，以及下载记录摘要或报告。

导航程序（**esearch**，**elink**，**efilter** 和 **efetch**）通过小型结构化消息进行通信，可以通过 Unix 管道在操作之间隐式传递。消息包括当前数据库，因此在第一步之后不需要作为参数给出。

辅助程序（**nquire**，**transmute** 和 **xtract**）可以帮助消除编写自定义软件来回答临时问题的需求。查询可以在 EDirect 程序和 Unix 实用程序或脚本之间无缝移动，以执行无法完全在 Entrez 内完成的操作。

所有 EDirect 程序都设计用于处理大数据集。它们在幕后处理了许多技术细节（避免了 E-utilities 编程通常需要的学习曲线）。中间结果要么保存在 Entrez 历史服务器上，要么在隐藏消息中实例化。为了获得最佳性能，请从 NCBI 获取 API 密钥，并在您的。bash_profile 和。zshrc 配置文件中放置以下行：

```bash
export NCBI_API_KEY=unique_api_key
```

通过键入程序名称，然后在命令行上提供任何必需或可选参数来运行 Unix 程序。参数名称是以连字符（“**‑**”）字符开头的字母或单词。

每个程序都有一个 **‑help** 命令，可打印有关可用参数的详细信息。

### 导航功能

Esearch 使用索引字段中的术语执行新的 Entrez 搜索。它需要一个 **‑db** 参数来指定数据库名称，并使用 **‑query** 来指定搜索术语。对于 PubMed，没有字段限定符，服务器使用自动术语映射来通过翻译提供的查询来组成搜索策略：

```bash
esearch -db pubmed -query "selective serotonin reuptake inhibitor"
```

搜索术语也可以用括号括住的字段名称限定，以匹配指定索引中的内容：

```bash
esearch -db nuccore -query "insulin [PROT] AND rodents [ORGN]"
```

Elink 查找数据库中的预计算邻居，或查找其他数据库中的相关记录：

```bash
elink -related

elink -target gene
```

Elink 还连接到 NIH 开放引文集合数据集，以查找引用选定 PubMed 文章的出版物，或关注 PubMed 记录的参考文献列表：

```bash
elink -cited

elink -cites
```

Efilter 限制先前查询的结果，并提供可在 esearch 中使用的快捷方式：

```bash
efilter -molecule genomic -location chloroplast -country sweden -mindate 1985
```

Efetch 以 **‑format** 指定的样式下载选定的记录或报告：

```bash
efetch -format abstract
```

无需编写脚本来循环处理小组记录，也无需编写代码在短暂的网络或服务器故障后重试，也无需在请求之间添加时间延迟。这些功能已内置于 EDirect 命令中。

### 构建多步骤查询

EDirect 允许单独描述各个操作，并通过使用竖线（“**|**”）Unix 管道符号将它们组合成多步骤查询：

```bash
esearch -db pubmed -query "tn3 transposition immunity" | efetch -format medline
```

### 在多行上编写命令

通过在按回车键之前立即键入反斜杠（“**\**”）Unix 转义字符，可以将查询继续到下一行。

```bash
esearch -db pubmed -query "opsin gene conversion" | \
```

继续查询查找原始论文的预计算邻居，接着链接到相关文章中发布的所有蛋白质序列，然后将这些序列限制为 GenBank 的啮齿动物分部，最后以 FASTA 格式检索记录：

```bash
elink -related | \
elink -target protein | \
efilter -division rod | \
efetch -format fasta
```

在大多数现代版本的 Unix 中，竖线管道符号还允许查询继续到下一行，而无需额外的反斜杠。

### 辅助程序

Nquire 通过从命令行参数构造的 URL 从远程服务器检索数据：

```bash
nquire -get https://icite.od.nih.gov api/pubs -pmids 2539356 |
```

Transmute 将连接的 JSON 对象流或其他结构化格式转换为 XML：

```
transmute -j2x |
```

Xtract 可以使用航路点导航复杂的 XML 层次结构，并按字段名获取数据值：

```bash
xtract -pattern data -element cited_by |
```

生成的输出可以由 Unix 实用程序或脚本进行后处理：

```bash
fmt -w 1 | sort -V | uniq
```

### 通过导航进行发现

PubMed 相关文章通过使用标题、摘要和医学主题词（MeSH 词）的统计文本检索算法计算得出。论文之间的连接可以用于发现。一个例子是找到维生素 A 生物合成途径中的最后一个酶促步骤。

植物中的番茄红素环化酶将番茄红素转化为β-胡萝卜素，这是维生素 A 的直接生化前体。对该酶的初步搜索发现了 303 篇文章。查找预计算的邻居返回了 18943 篇论文，其中一些可能会讨论途径中的其他酶：

```bash
esearch -db pubmed -query "lycopene cyclase" | elink -related |
```

已知β-胡萝卜素是一种必需营养素，需要在食草动物的饮食中。 这表明番茄红素环化酶不存在于动物中（由于水平基因转移造成的少数例外），而负责将β-胡萝卜素转化为维生素 A 的酶不存在于植物中。

应用此知识，通过将出版物邻居链接到其相关的蛋白质记录，然后使用 NCBI 分类法过滤这些候选者，可以帮助找到所需的酶。

从 PubMed 链接到蛋白质数据库可以找到 520,222 个蛋白质序列：

```bash
elink -target protein |
```

将其限制为小鼠可排除植物、真菌和细菌，从而消除了早期的酶：

```bash
efilter -organism mouse -source refseq |
```

这匹配了 26 个序列，足够通过检索单个记录进行检查：

```bash
efetch -format fasta
```

如预期的那样，结果包括将β-胡萝卜素分裂为两分子视黄醛的酶：

```
...
>NP_067461.2 beta,beta-carotene 15,15'-dioxygenase isoform 1 [Mus musculus]
MEIIFGQNKKEQLEPVQAKVTGSIPAWLQGTLLRNGPGMHTVGESKYNHWFDGLALLHSFSIRDGEVFYR
SKYLQSDTYIANIEANRIVVSEFGTMAYPDPCKNIFSKAFSYLSHTIPDFTDNCLINIMKCGEDFYATTE
TNYIRKIDPQTLETLEKVDYRKYVAVNLATSHPHYDEAGNVLNMGTSVVDKGRTKYVIFKIPATVPDSKK
...
```

### 检索 PubMed 报告

将 PubMed 查询结果传递给 efetch 并指定“abstract”格式：

```bash
esearch -db pubmed -query "lycopene cyclase" |
efetch -format abstract
```

返回一组可以阅读的报告：

```
...
85. PLoS One. 2013;8(3):e58144. doi: 10.1371/journal.pone.0058144. Epub ...

Levels of lycopene β-cyclase 1 modulate carotenoid gene expression and
accumulation in Daucus carota.

Moreno JC(1), Pizarro L, Fuentes P, Handford M, Cifuentes V, Stange C.

Author information:
(1)Departamento de Biología, Facultad de Ciencias, Universidad de Chile,
Santiago, Chile.

Plant carotenoids are synthesized and accumulated in plastids through a
highly regulated pathway. Lycopene β-cyclase (LCYB) is a key enzyme
involved directly in the synthesis of α-carotene and β-carotene through
...
```

如果使用“medline”格式：

```bash
esearch -db pubmed -query "lycopene cyclase" |
efetch -format medline
```

输出可以输入到常见的书目管理软件包中：

```
...
PMID- 23555569
OWN - NLM
STAT- MEDLINE
DA  - 20130404
DCOM- 20130930
LR  - 20131121
IS  - 1932-6203 (Electronic)
IS  - 1932-6203 (Linking)
VI  - 8
IP  - 3
DP  - 2013
TI  - Levels of lycopene beta-cyclase 1 modulate carotenoid gene expression
    and accumulation in Daucus carota.
PG  - e58144
LID - 10.1371/journal.pone.0058144 [doi]
AB  - Plant carotenoids are synthesized and accumulated in plastids
    through a highly regulated pathway. Lycopene beta-cyclase (LCYB) is a
    key enzyme involved directly in the synthesis of alpha-carotene and
    ...
```

### 检索序列报告

可以以 FASTA 格式下载核苷酸和蛋白质记录：

```bash
esearch -db protein -query "lycopene cyclase" |
efetch -format fasta
```

它包括一个定义行，后跟序列：

```
...
>gi|735882|gb|AAA81880.1| lycopene cyclase [Arabidopsis thaliana]
MDTLLKTPNKLDFFIPQFHGFERLCSNNPYPSRVRLGVKKRAIKIVSSVVSGSAALLDLVPETKKENLDF
ELPLYDTSKSQVVDLAIVGGGPAGLAVAQQVSEAGLSVCSIDPSPKLIWPNNYGVWVDEFEAMDLLDCLD
TTWSGAVVYVDEGVKKDLSRPYGRVNRKQLKSKMLQKCITNGVKFHQSKVTNVVHEEANSTVVCSDGVKI
QASVVLDATGFSRCLVQYDKPYNPGYQVAYGIIAEVDGHPFDVDKMVFMDWRDKHLDSYPELKERNSKIP
TFLYAMPFSSNRIFLEETSLVARPGLRMEDIQERMAARLKHLGINVKRIEEDERCVIPMGGPLPVLPQRV
VGIGGTAGMVHPSTGYMVARTLAAAPIVANAIVRYLGSPSSNSLRGDQLSAEVWRDLWPIERRRQREFFC
FGMDILLKLDLDATRRFFDAFFDLQPHYWHGFLSSRLFLPELLVFGLSLFSHASNTSRLEIMTKGTVPLA
KMINNLVQDRD
...
```

## 检索 GenBank 或 GenPept 平面文件中的序列记录

```bash
esearch -db protein -query "lycopene cyclase" |
efetch -format gp
```

这些文件包含注释特定序列区域的特征：

```
...
LOCUS       AAA81880                 501 aa            linear   PLN ...
DEFINITION  lycopene cyclase [Arabidopsis thaliana].
ACCESSION   AAA81880
VERSION     AAA81880.1  GI:735882
DBSOURCE    locus ATHLYC accession L40176.1
KEYWORDS    .
SOURCE      Arabidopsis thaliana (thale cress)
ORGANISM    Arabidopsis thaliana
            Eukaryota; Viridiplantae; Streptophyta; Embryophyta;
            Tracheophyta; Spermatophyta; Magnoliophyta; eudicotyledons;
            Brassicales; Brassicaceae; Camelineae; Arabidopsis.
REFERENCE   1  (residues 1 to 501)
AUTHORS     Scolnik,P.A. and Bartley,G.E.
TITLE       Nucleotide sequence of lycopene cyclase (GenBank L40176) from
            Arabidopsis (PGR95-019)
JOURNAL     Plant Physiol. 108 (3), 1343 (1995)
...
FEATURES             Location/Qualifiers
   source          1..501
                   /organism="Arabidopsis thaliana"
                   /db_xref="taxon:3702"
   Protein         1..501
                   /product="lycopene cyclase"
   transit_peptide 1..80
   mat_peptide     81..501
                   /product="lycopene cyclase"
   CDS             1..501
                   /gene="LYC"
                   /coded_by="L40176.1:2..1507"
ORIGIN
      1 mdtllktpnk ldffipqfhg ferlcsnnpy psrvrlgvkk raikivssvv sgsaalldlv
     61 petkkenldf elplydtsks qvvdlaivgg gpaglavaqq vseaglsvcs idpspkliwp
    121 nnygvwvdef eamdlldcld ttwsgavvyv degvkkdlsr pygrvnrkql kskmlqkcit
    181 ngvkfhqskv tnvvheeans tvvcsdgvki qasvvldatg fsrclvqydk pynpgyqvay
    241 giiaevdghp fdvdkmvfmd wrdkhldsyp elkernskip tflyampfss nrifleetsl
    301 varpglrmed iqermaarlk hlginvkrie edercvipmg gplpvlpqrv vgiggtagmv
    361 hpstgymvar tlaaapivan aivrylgsps snslrgdqls aevwrdlwpi errrqreffc
    421 fgmdillkld ldatrrffda ffdlqphywh gflssrlflp ellvfglslf shasntsrle
    481 imtkgtvpla kminnlvqdr d
//
...
```

## 搜索和过滤

### 限制查询结果

当前的结果可以通过在 Entrez 中进一步搜索术语进行细化（在蛋白质数据库中限制 BLAST 邻居到分类子集时很有用）：

```bash
esearch -db pubmed -query "opsin gene conversion" |
elink -related |
efilter -query "tetrachromacy"
```

### 按日期限制

结果也可以按日期过滤。例如，以下语句：

```bash
efilter -days 60 -datetype PDAT

efilter -mindate 2000

efilter -maxdate 1985

efilter -mindate 1990 -maxdate 1999
```

分别将结果限制为过去两个月内发布的文章、自 2000 年开始的文章、到 1985 年底为止的文章或 1990 年代的文章。YYYY/MM 和 YYYY/MM/DD 日期格式也被接受。

### 通过标识符获取

Efetch 和 elink 可以在 **-id** 参数中接受一组数字标识符或登录号：

```bash
efetch -db pubmed -id 7252148,1937004 -format xml

efetch -db nuccore -id 1121073309 -format acc

efetch -db protein -id 3OQZ_a -format fasta

efetch -db bioproject -id PRJNA257197 -format docsum

efetch -db pmc -id PMC209839 -format medline

elink -db pubmed -id 2539356 -cites
```

无需先前的 esearch 命令。

非整数登录号将通过内部搜索进行查找，使用数据库的适当字段：

```bash
esearch -db bioproject -query "PRJNA257197 [PRJA]" |
efetch -format uid | ...
```

大多数数据库使用 [ACCN] 字段进行标识符查找，但有一些例外：

```bash
annotinfo      [ASAC]
assembly       [ASAC]
bioproject     [PRJA]
books          [AID]
clinvar        [VACC]
gds            [ALL]
genome         [PRJA]
geoprofiles    [NAME]
gtr            [GTRACC]
mesh           [MHUI]
nuccore        [ACCN] 或 [PACC]
pcsubstance    [SRID]
snp            [RS] 或 [SS]
```

（对于 -db pmc，它只是从整数标识符中删除任何 "PMC" 前缀。）

为了向后兼容，**esummary** 是 esearch -format docsum 的快捷方式：

```bash
esummary -db bioproject -id PRJNA257197

esummary -db sra -id SRR5437876
```

### 读取大列表标识符

Efetch 和 elink 还可以通过 stdin 读取大列表标识符或登录号：

```bash
cat "file_of_identifiers.txt" |
efetch -db pubmed -format docsum
```

或从由 **-input** 参数指示的文件中读取：

```bash
efetch -input "file_of_identifiers.txt" -db pubmed -format docsum
```

如上所述，无需使用脚本将标识符拆分为较小的组或在各个请求之间添加时间延迟，因为这些功能已内置在 EDirect 中。

### 索引字段

**einfo** 命令可以报告为每个数据库索引的字段和链接：

```bash
einfo -db protein -fields
```

这将返回一个为蛋白质索引的字段缩写和名称的表格：

```
ACCN    Accession
ALL     All Fields
ASSM    Assembly
AUTH    Author
BRD     Breed
CULT    Cultivar
DIV     Division
ECNO    EC/RN Number
FILT    Filter
FKEY    Feature key
...
```

### 按索引字段限定查询

在 esearch 或 efilter 中的查询术语可以通过输入索引字段缩写在括号中进行限定。布尔运算符和括号也可以在查询表达式中使用，以进行更复杂的搜索。

PubMed 查询中常用的字段包括：

```
[AFFL]    Affiliation           [LANG]    Language
[ALL]     All Fields            [MAJR]    MeSH Major Topic
[AUTH]    Author                [SUBH]    MeSH Subheading
[FAUT]    Author - First        [MESH]    MeSH Terms
[LAUT]    Author - Last         [PTYP]    Publication Type
[CRDT]    Date - Create         [WORD]    Text Word
[PDAT]    Date - Publication    [TITL]    Title
[FILT]    Filter                [TIAB]    Title/Abstract
[JOUR]    Journal               [UID]     UID
```

一个限定查询示例如下：

```
"Tager HS [AUTH] AND glucagon [TIAB]"
```

限制 PubMed 搜索结果到子集的过滤器包括：

```
humans [MESH]
pharmacokinetics [MESH]
chemically induced [SUBH]
all child [FILT]
english [FILT]
freetext [FILT]
has abstract [FILT]
historical article [FILT]
randomized controlled trial [FILT]
clinical trial, phase ii [PTYP]
review [PTYP]
```

序列数据库使用一组不同的搜索字段进行索引，包括：

```
[ACCN]    登录号         [MLWT]    分子量
[ALL]     所有字段       [ORGN]    生物体
[AUTH]    作者           [PACC]    主登录号
[GPRJ]    生物项目       [PROP]    属性
[BIOS]    生物样本       [PROT]    蛋白质名称
[ECNO]    EC/RN 编号     [SQID]    序列 ID 字符串
[FKEY]    功能键         [SLEN]    序列长度
[FILT]    过滤器         [SUBS]    物质名称
[GENE]    基因名称       [WORD]    文本词
[JOUR]    期刊           [TITL]    标题
[KYWD]    关键词         [UID]     唯一标识符
```

蛋白质数据库中的示例查询如下：

```
"alcohol dehydrogenase [PROT] NOT (bacteria [ORGN] OR fungi [ORGN])"
```

序列数据库中的子集过滤器示例包括：

```
mammalia [ORGN]
mammalia [ORGN:noexp]
txid40674 [ORGN]
cds [FKEY]
lacz [GENE]
beta galactosidase [PROT]
protein snp [FILT]
reviewed [FILT]
country united kingdom glasgow [TEXT]
biomol genomic [PROP]
dbxref flybase [PROP]
gbdiv phg [PROP]
phylogenetic study [PROP]
sequence from mitochondrion [PROP]
src cultivar [PROP]
srcdb refseq validated [PROP]
150:200 [SLEN]
```

（计算的分子量（MLWT）字段仅在蛋白质（和结构）中索引，而不是在核苷酸中。）

有关几个 Entrez 数据库可用的过滤器快捷方式的列表，请参见 **efilter ‑help**。

### 检查中间结果

EDirect 导航功能生成一个包含相关字段（数据库、网络环境、查询键和记录数）的自定义 XML 消息，可以由流水线中的下一个命令读取。EDirect 可能会将中间结果存储在 Entrez 历史服务器上，或在 XML 消息中实例化它们。

可以检查查询中每一步的结果，以确认预期行为，然后再添加下一步。ENTREZ_DIRECT 对象中的 Count 字段包含上一步返回的记录数。查询成功的一个好标志是合理（非零）的计数值。例如：

```bash
esearch -db protein -query "tryptophan synthase alpha chain [PROT]" |
efilter -query "28000:30000 [MLWT]" |
elink -target structure |
efilter -query "0:2 [RESO]"
```

生成：

```
<ENTREZ_DIRECT>
  <Db>structure</Db>
  <WebEnv> MCID_5fac27e119f45d4eca20b0e6</WebEnv>
  <QueryKey>32</QueryKey>
  <Count>58</Count>
  <Step>4</Step>
</ENTREZ_DIRECT>
```

其中包含 58 个符合指定分子量范围并具有所需（X 射线晶体学）原子位置分辨率的蛋白质结构。

（QueryKey 值不同于 Step，因为 elink 命令将其查询拆分为较小的块，以避免服务器截断限制和超时错误。）

### 组合独立查询

可以执行独立的 esearch、elink 和 efilter 操作，然后使用历史服务器的“**#**”约定表示查询键号在末尾进行组合。（要组合的步骤必须在同一个数据库中。）后续的 esearch 命令可以使用 ‑db 参数覆盖从前一步传递的数据库。（将查询连接在一起是必要的，以共享相同的历史线程。）

由于 elink 将大型查询拆分为多个较小的链接请求，因此无法预先预测新的 QueryKey 值。使用 ‑label 参数可以解决此问题。标签值前缀为 "#" 符号，并在最终搜索中括在括号内。例如，查询：

```bash
esearch -db protein -query "amyloid* [PROT]" |
elink -target pubmed -label prot_cit |
esearch -db gene -query "apo* [GENE]" |
elink -target pubmed -label gene_cit |
esearch -query "(#prot_cit) AND (#gene_cit)" |
efetch -format docsum |
xtract -pattern DocumentSummary -element Id Title
```

使用截断搜索（输入单词开头并跟随星号）返回与淀粉样蛋白序列和载脂蛋白基因记录相关联的论文标题：

```
23962925    Genome analysis reveals insights into physiology and ...
23959870    Low levels of copper disrupt brain amyloid-β homeostasis ...
23371554    Genomic diversity and evolution of the head crest in the ...
23251661    Novel genetic loci identified for the pathophysiology of ...
...
```

## 结构化数据

### XML 格式的优点

能够以结构化可扩展标记语言（XML）格式获取 Entrez 记录，并轻松提取基础数据，使用户能够提出现有分析软件未解决的新问题。

XML 的优点在于信息位于特定位置，具有良好定义的数据层次结构。访问按名称分隔的各个数据单元，例如：

```
<PubDate>2013</PubDate>
<Source>PLoS One</Source>
<Volume>8</Volume>
<Issue>3</Issue>
<Pages>e58144</Pages>
```

需要匹配相同的一般模式，只需更改元素名称。这比从长而复杂的字符串中解析单元简单得多：

```
1. PLoS One. 2013;8(3):e58144 ...
```

XML 的缺点是数据提取通常需要编程。但 EDirect 依靠 XML 值表示的通用模式，提供了一种简化的 XML 数据解释方法。

### 将 XML 转换为表格

xtract 程序使用命令行参数来指导 XML 格式数据的选择性转换。它允许记录检测、路径探索、元素选择、条件处理和报告格式的独立控制。

**‑pattern** 命令按对象名称将 XML 流划分为单独的记录，分别处理。在每个记录中，**‑element** 命令执行深入优先搜索，以按字段名称查找数据内容。不需要对象的显式路径。

默认情况下，-pattern 参数将结果划分为行，而数据放置到列中则由 -element 控制，以创建制表符分隔的表格。

### 格式自定义

格式化命令允许对输出进行广泛的自定义。行间的换行符由 **‑ret** 更改，而 -element 列间的制表符由 **‑tab** 修改。相同元素的多个实例使用 **‑sep** 区分，其分隔独立于 -tab 命令。以下查询：

```bash
efetch -db pubmed -id 6271474,6092233,16589597 -format docsum |
xtract -pattern DocumentSummary -sep "|" -element Id PubDate Name
```

返回一个制表符分隔的表格，单个作者名用竖线分隔：

```
6271474     1981            Casadaban MJ|Chou J|Lemaux P|Tu CP|Cohen SN
6092233     1984 Jul-Aug    Calderon IL|Contopoulou CR|Mortimer RK
16589597    1954 Dec        Garber ED
```

-sep 值也适用于用逗号分隔的多个 -element 参数。这可以用于将多个相关字段的数据保存在同一列中：

```bash
-sep " " -element Initials,LastName
```

字段组由 **-pfx** 值前缀，后跟 **-sfx** 值，两个值最初都是空的。

**-def** 命令设置默认占位符，当 -element 子句中的逗号分隔字段都不存在时打印：

```bash
-def "-" -sep " " -element Year,Month,MedlineDate
```

重新打包命令（**-wrp**、**-enc** 和 **-pkg**）使用括起来的 XML 标签包装提取的数据值，只需对象名称即可。例如，“-wrp Word”发出以下格式说明：

```bash
-pfx "<Word>" -sep "</Word><Word>" -sfx "</Word>"
```

并且还确保包含编码的角括号、&符号、引号或撇号的数据值在新的 XML 中保持正确编码。

其他命令（**-tag**、**-att**、**-atr**、**-cls**、**-slf** 和 **-end**）允许生成具有属性的 XML 标签。运行：

```bash
-tag Item -att type journal -cls -element Source -end Item \
-deq "\n" -tag Item -att type journal -atr name Source -slf
```

将分别生成常规和自闭合的 XML 对象：

```
<Item type="journal">J Bacteriol</Item>
<Item type="journal" name="J Bacteriol" />
```

### 元素变体

-element 的派生被创建，以消除编写后处理脚本执行对提取数据进行的常规修改或分析的不便。它们被分为几个类别。根据需要替换-element。以下是代表性选择：

```
位置：       -first, -last, -even, -odd, -backward

数字：       -num, -len, -inc, -dec, -bin, -hex, -bit

统计：       -sum, -acc, -min, -max, -dev, -med

平均：       -avg, -geo, -hrm, -rms

对数：       -lge, -lg2, -log

字符：       -encode, -upper, -title, -mirror, -alnum

字符串：     -basic, -plain, -simple, -author, -journal, -prose

文本：       -words, -pairs, -letters, -order, -reverse

引用：       -year, -month, -date, -page, -auth

序列：       -revcomp, -fasta, -ncbi2na, -molwt, -pentamers

翻译：       -cds2prot, -gcode, -frame

坐标：       -0-based, -1-based, -ucsc-based

变异：       -hgvs

频率：       -histogram

表达：       -reg, -exp, -replace

替换：       -transform, -translate

索引：       -aliases, -classify

杂项：       -doi, -wct, -trim, -pad, -accession, -numeric
```

原始-元素前缀快捷方式“**#**”和“**%**”分别重定向到 **-num** 和 **-len**。

参见 xtract **-help** 获取每个命令的简要描述。

### 探索控制

探索命令提供了对检查 XML 记录内容顺序的精细控制，通过分别呈现所选子区域的每个实例。这限制了后续命令在任何时候“看到”的内容，并允许将对象中的相关字段保持在一起。

与更简单的 DocumentSummary 格式相比，作为 PubmedArticle XML 检索的记录：

```bash
efetch -db pubmed -id 1413997 -format xml |
```

作者具有分开的姓氏和首字母字段：

```
<Author>
  <LastName>Mortimer</LastName>
  <Initials>RK</Initials>
</Author>
```

如果没有提供任何关于上下文的指导，在首字母和姓氏上的-元素命令：

```bash
efetch -db pubmed -id 1413997 -format xml |
xtract -pattern PubmedArticle -element Initials LastName
```

将依次检查当前记录中的每个参数，打印所有首字母，然后是所有姓氏：

```
RK    CR    JS    Mortimer    Contopoulou    King
```

插入一个 **-block** 命令在 -pattern 和 -element 之间增加另一个探索层，并将数据探索重定向为一次呈现一个作者：

```bash
efetch -db pubmed -id 1413997 -format xml |
xtract -pattern PubmedArticle -block Author -element Initials LastName
```

每次循环，-element 命令只能看到当前作者的值。这恢复了输出中首字母和姓氏的正确关联：

```
RK    Mortimer    CR    Contopoulou    JS    King
```

使用逗号将两个作者子字段分组，并调整-sep 和-tab 值：

```bash
efetch -db pubmed -id 1413997 -format xml |
xtract -pattern PubmedArticle -block Author \
  -sep " " -tab ", " -element Initials,LastName
```

产生更传统的作者姓名格式：

```
RK Mortimer, CR Contopoulou, JS King
```

### 顺序探索

可以在单个 xtract 中使用多个-block 语句来探索 XML 的不同区域。这限制了元素提取到所需的子区域，并允许区分具有相同名称的字段。例如：

```bash
efetch -db pubmed -id 6092233,4640931,4296474 -format xml |
xtract -pattern PubmedArticle -element MedlineCitation/PMID \
  -block PubDate -sep " " -element Year,Month,MedlineDate \
  -block AuthorList -num Author -sep "/" -element LastName |
sort-table -k 3,3n -k 4,4f
```

生成一个表格，允许轻松解析作者姓氏，并按作者数量排序结果：

```
4296474    1968 Apr        1    Friedmann
4640931    1972 Dec        2    Tager/Steiner
6092233    1984 Jul-Aug    3    Calderon/Contopoulou/Mortimer
```

与-element 参数一样，单个-block 语句按出现顺序依次执行。

注意，“-element MedlineCitation/PMID”使用**父/子**结构防止显示后续 CommentsCorrections 对象中可能存在的额外 PMID 项。

还要注意，PubDate 对象可以是结构化形式：

```
<PubDate>
  <Year>1968</Year>
  <Month>Apr</Month>
  <Day>25</Day>
</PubDate>
```

（Day 字段通常缺失），或字符串形式：

```
<PubDate>
  <MedlineDate>1984 Jul-Aug</MedlineDate>
</PubDate>
```

但不会混合两种类型，因此指令：

```bash
-element Year,Month,MedlineDate
```

只会为输出贡献一列。

### 嵌套探索

探索命令名称（**-group**、**-block** 和 **-subset**）被分配给优先层次结构：

```
-pattern > -group > -block > -subset > -element
```

并按等级顺序组合，以在 XML 数据结构中逐步更深的层次上控制对象迭代。每个命令参数充当“嵌套 for 循环”控制变量，保留有关其级别上的上下文或探索状态的信息。

（假设）人口普查数据需要几个嵌套循环以在上下文中访问每个唯一地址：

```bash
-pattern State -group City -block Street -subset Number -element Resident
```

一个核苷酸或蛋白质序列记录可以有多个特征。每个特征可以有多个限定符。每个限定符都有单独的名称和值节点。探索这个自然数据层次结构，使用 **-pattern** 表示序列，**-group** 表示特征，**-block** 表示限定符：

```bash
efetch -db nuccore -id NG_008030.1 -format gbc |
xtract -pattern INSDSeq -element INSDSeq_accession-version \
  -group INSDFeature -deq "\n\t" -element INSDFeature_key \
    -block INSDQualifier -deq "\n\t\t" \
      -element INSDQualifier_name INSDQualifier_value
```

使限定符（如 gene 和 product）与其父特征相关联，并使限定符名称和值在同一行中保持在一起：

```
NG_008030.1
  source
            organism         Homo sapiens
            mol_type         genomic DNA
            db_xref          taxon:9606
  gene
            gene             COL5A1
  mRNA
            gene             COL5A1
            product          collagen type V alpha 1 chain, transcript variant 1
            transcript_id    NM_000093.4
  CDS
            gene             COL5A1
            product          collagen alpha-1(V) chain isoform 1 preproprotein
            protein_id       NP_000084.3
            translation      MDVHTRWKARSALRPGAPLLPPLLLLLLWAPPPSRAAQP...
            ...
```

### 将数据保存到变量中

可以将值记录在变量中，并在需要时使用。变量由一个连字符后跟一个由大写字母或数字组成的字符串名称（例如，**-KEY**）创建。在-element 语句中通过在变量名称前加上一个符号（例如，“**&KEY**”）来检索变量值：

```bash
efetch -db nuccore -id NG_008030.1 -format gbc |
xtract -pattern INSDSeq -element INSDSeq_accession-version \
  -group INSDFeature -KEY INSDFeature_key \
    -block INSDQualifier -deq "\n\t" \
      -element "&KEY" INSDQualifier_name INSDQualifier_value
```

此版本在限定符名称和值之前打印特征键，即使特征键现在超出了可见范围（当前限定符）：

```
NG_008030.1
  source    organism         Homo sapiens
  source    mol_type         genomic DNA
  source    db_xref          taxon:9606
  gene      gene             COL5A1
  mRNA      gene             COL5A1
  mRNA      product          collagen type V alpha 1 chain, transcript variant 1
  mRNA      transcript_id    NM_000093.4
  CDS       gene             COL5A1
  CDS       product          collagen alpha-1(V) chain isoform 1 preproprotein
  CDS       protein_id       NP_000084.3
  CDS       translation      MDVHTRWKARSALRPGAPLLPPLLLLLLWAPPPSRAAQP...
  ...
```

可以在括号内使用显式文字值（重新）初始化变量：

```bash
-block Author -sep " " -tab "" -element "&COM" Initials,LastName -COM "(, )"
```

它们还可以用作条件语句中的第一个参数：

```bash
-CHR Chromosome -block GenomicInfoType -if "&CHR" -differs-from ChrLoc
```

使用双连字符（例如，**--STATS**）可以将值附加到变量中。

此外，变量还可以保存由**-**元素变体操作产生的修改后的数据。这允许在单个 xtract 命令中进行多次顺序转换：

```bash
-END -sum "Start,Length" -MID -avg "Start,&END"
```

处理下一个记录时，所有变量都会重置。

### 条件执行

条件处理命令（**-if**、**-unless**、**-and**、**-or** 和 **-else**）通过数据内容限制对象探索。它们检查命名字段是否在范围内，并可与字符串、数字或对象约束结合使用，以要求值匹配。例如：

```bash
esearch -db pubmed -query "Havran W [AUTH]" |
efetch -format xml |
xtract -pattern PubmedArticle -if "#Author" -lt 14 \
  -block Author -if LastName -is-not Havran \
    -sep ", " -tab "\n" -element LastName,Initials[1:1] |
sort-uniq-count-rank
```

选择少于 14 个作者的论文，并打印最常见合作者的表格，使用范围保留第一个首字母，以便将“Berg, CM”和“Berg, C”之类的变体合并：

```
34    Witherden, D
15    Boismenu, R
12    Jameson, J
10    Allison, J
10    Fitch, F
...
```

数值约束还可以比较两个字段的整数值。这可以用来查找在负链上编码的基因：

```bash
-if ChrStart -gt ChrStop
```

对象约束将比较两个命名字段的字符串值，并可以查找在大多数情况下应相同的字段之间的内部不一致：

```bash
-if Chromosome -differs-from ChrLoc
```

**-position** 命令通过相对位置或索引号限制对象的呈现：

```bash
-block Author -position last -sep ", " -element LastName,Initials
```

多个条件通过 **-and** 和 **-or** 命令指定：

```bash
-if @score -equals 1 -or @score -starts-with 0.9
```

**-else** 命令可以提供替代的 -element 或 **-lbl** 指令，如果条件不满足则运行：

```bash
-if MapLocation -element MapLocation -else -lbl "\-"
```

但在简单情况下，使用-def 设置默认值可能更方便。

并行-if 和-unless 语句可用于对包含嵌套探索的替代条件提供更复杂的响应。

### 后处理功能

Elink **-cited** 可以执行反向引用查找，感谢 NIH 开放引用集合提供的数据服务。提取的作者姓名可以通过管道传输到一系列 Unix 实用程序进行处理：

```bash
esearch -db pubmed -query "Beadle GW [AUTH]" |
elink -cited |
efetch -format docsum |
xtract -pattern Author -element Name |
sort -f | uniq -i -c
```

生成引用原始论文的作者的字母顺序计数：

```
1 Abellan-Schneyder I
1 Abramowitz M
1 ABREU LA
1 ABREU RR
1 Abril JF
1 Abächerli E
1 Achetib N
1 Adams CM
2 ADELBERG EA
1 Adrian AB
...
```

与其每次都重新输入一系列常见的后处理指令，不如将经常使用的 Unix 命令组合放在一个函数中，存储在一个别名文件中（例如用户的。bash_profile），并通过名称执行。例如：

```bash
SortUniqCountRank() {
  grep '.' |
  sort -f |
  uniq -i -c |
  awk '{ n=$1; sub(/[ \t]*[0-9]+[ \t]/, ""); print n "\t" $0 }' |
  sort -t "$(printf '\t')" -k 1,1nr -k 2f
}
alias sort-uniq-count-rank='SortUniqCountRank'
```

（接受自定义参数的增强版 **sort-uniq-count-rank** 现已作为独立脚本包含在 EDirect 中。）

原始作者姓名可以直接传递到 sort-uniq-count-rank 脚本：

```bash
esearch -db pubmed -query "Beadle GW [AUTH]" |
elink -cited |
efetch -format docsum |
xtract -pattern Author -element Name |
sort-uniq-count-rank
```

生成一个引用原始论文次数最多的作者的制表符分隔的排名列表：

```
17    Hawley RS
13    Beadle GW
13    PERKINS DD
11    Glass NL
11    Vécsei L
10    Toldi J
9     TATUM EL
8     Ephrussi B
8     LEDERBERG J
...
```

同样地，elink **‑cites** 使用 NIH OCC 数据返回文章的参考文献列表。

其他用于制表符分隔文件的脚本包括 **sort-table**、**reorder-columns** 和 **align-columns**。Unix 参数扩展需要 **filter-columns** 和 **print-columns** 参数在单引号中。

请注意，EDirect 命令也可以在 Unix 函数或脚本中使用。

### 查看 XML 层次结构

将 PubmedArticle XML 对象通过管道传输到 xtract **‑outline** 将给出 XML 层次结构的缩进概述：

```
PubmedArticle
  MedlineCitation
    PMID
    DateCompleted
      Year
      Month
      Day
    ...
    Article
      Journal
        ...
        Title
        ISOAbbreviation
      ArticleTitle
      ...
      Abstract
        AbstractText
      AuthorList
        Author
          LastName
          ForeName
          Initials
          AffiliationInfo
            Affiliation
        Author
          ...
```

使用 xtract **‑synopsis** 或 **‑contour** 将分别显示所有节点的完整路径或仅显示终端（叶）节点的路径。将这些结果通过管道传输到“sort-uniq-count”将生成一个唯一路径的表格。

### 代码嵌套比较

使用缩进的伪代码进行草图可以阐明相对的嵌套级别。提取命令：

```bash
xtract -pattern PubmedArticle \
  -block Author -element Initials,LastName \
  -block MeshHeading \
    -if QualifierName \
      -element DescriptorName \
      -subset QualifierName -element QualifierName
```

其中参数名称的级别控制嵌套深度，可以用伪代码表示为：

```
for pat = each PubmedArticle {
  for blk = each pat.Author {
    print blk.Initials blk.LastName
  }
  for blk = each pat.MeSHTerm {
    if blk.Qual is present {
      print blk.MeshName
      for sbs = each blk.Qual {
        print sbs.QualName
      }
    }
  }
}
```

其中大括号的缩进计数控制嵌套深度。

额外的参数保留用于在处理复杂的、深度嵌套的 XML 数据时提供额外的组织级别。以下-exploration 命令在-pattern 之下，按级别排列为：

```
-path
  -division
    -group
      -branch
        -block
          -section
            -subset
              -unit
```

从-block 开始进行 xtract 探索，并使用-group 和-subset 进行扩展，保留了额外的级别名称，可以在需要时使用，而无需重新设计整个命令。

## 复杂对象

### 作者探索

名字中包含什么？我们称之为作者的东西，无论是财团、调查员还是编辑，都是：

```
<PubmedArticle>
  <MedlineCitation>
    <PMID>99999999</PMID>
    <Article>
      <AuthorList>
        <Author>
          <LastName>Tinker</LastName>
        </Author>
        <Author>
          <LastName>Evers</LastName>
        </Author>
        <Author>
          <LastName>Chance</LastName>
        </Author>
        <Author>
          <CollectiveName>FlyBase Consortium</CollectiveName>
        </Author>
      </AuthorList>
    </Article>
    <InvestigatorList>
      <Investigator>
        <LastName>Alpher</LastName>
      </Investigator>
      <Investigator>
        <LastName>Bethe</LastName>
      </Investigator>
      <Investigator>
        <LastName>Gamow</LastName>
      </Investigator>
    </InvestigatorList>
  </MedlineCitation>
</PubmedArticle>
```

在记录中，对姓氏进行-element 探索：

```bash
xtract -pattern PubmedArticle -element LastName
```

打印每个姓氏，但不匹配财团：

```
Tinker    Evers    Chance    Alpher    Bethe    Gamow
```

限制到作者列表：

```bash
xtract -pattern PubmedArticle -block AuthorList -element LastName
```

排除调查员：

```
Tinker    Evers    Chance
```

在每种对象类型上使用-num：

```bash
xtract -pattern PubmedArticle -num Author Investigator LastName CollectiveName
```

显示各种对象的计数：

```
4    3    6    1
```

### 日期选择

日期有各种形式和大小：

```
<PubmedArticle>
  <MedlineCitation>
    <PMID>99999999</PMID>
    <DateCompleted>
      <Year>2011</Year>
    </DateCompleted>
    <DateRevised>
      <Year>2012</Year>
    </DateRevised>
    <Article>
      <Journal>
        <JournalIssue>
          <PubDate>
            <Year>2013</Year>
          </PubDate>
        </JournalIssue>
      </Journal>
      <ArticleDate>
        <Year>2014</Year>
      </ArticleDate>
    </Article>
  </MedlineCitation>
  <PubmedData>
    <History>
      <PubMedPubDate PubStatus="received">
        <Year>2015</Year>
      </PubMedPubDate>
      <PubMedPubDate PubStatus="accepted">
        <Year>2016</Year>
      </PubMedPubDate>
      <PubMedPubDate PubStatus="entrez">
        <Year>2017</Year>
      </PubMedPubDate>
      <PubMedPubDate PubStatus="pubmed">
        <Year>2018</Year>
      </PubMedPubDate>
      <PubMedPubDate PubStatus="medline">
        <Year>2019</Year>
      </PubMedPubDate>
    </History>
  </PubmedData>
</PubmedArticle>
```

在记录中，对年份进行-element 探索：

```bash
xtract -pattern PubmedArticle -element Year
```

查找并打印所有九个实例：

```
2011    2012    2013    2014    2015    2016    2017    2018    2019
```

使用-block 来限制范围：

```bash
xtract -pattern PubmedArticle -block History -element Year
```

仅打印 History 对象中的五个年份：

```
2015    2016    2017    2018    2019
```

插入条件语句以将元素选择限制为具有特定属性的日期：

```bash
xtract -pattern PubmedArticle -block History \
  -if @PubStatus -equals "pubmed" -element Year
```

令人惊讶的是，仍然打印 History 中的五个年份：

```
2015    2016    2017    2018    2019
```

这是因为-if 命令使用与-element 相同的探索逻辑，但设计为如果在当前范围内找到匹配，则声明成功。History 中确实存在一个"pubmed"属性，在五个 PubMedPubDate 子对象中的一个中，因此测试成功。因此，-element 在 History 中具有自由探索权，打印所有五个年份。

解决方案是探索单个 PubMedPubDate 对象：

```bash
xtract -pattern PubmedArticle -block PubMedPubDate \
  -if @PubStatus -equals "pubmed" -element Year
```

这将分别访问每个 PubMedPubDate 对象，-if 测试仅匹配指定的日期类型，从而仅返回所需的年份：

```
2018
```

### PMID 提取

由于存在 CommentsCorrections 对象：

```
<PubmedArticle>
  <MedlineCitation>
    <PMID>99999999</PMID>
    <CommentsCorrectionsList>
      <CommentsCorrections RefType="ErratumFor">
        <PMID>88888888</PMID>
      </CommentsCorrections>
    </CommentsCorrectionsList>
  </MedlineCitation>
</PubmedArticle>
```

尝试打印记录的 PubMed 标识符：

```bash
xtract -pattern PubmedArticle -element PMID
```

也会返回评论的 PMID：

```
99999999    88888888
```

使用探索命令无法排除第二个实例，因为它需要一个唯一的父节点来对应第一个元素，并且到第一个 PMID 的父节点链：

```
PubmedArticle/MedlineCitation
```

是到第二个 PMID 的父节点链的子集：

```
PubmedArticle/MedlineCitation/CommentsCorrectionList/CommentsCorrections
```

虽然**-first** PMID 在这种情况下可行，但更普遍的解决方案是使用父/子结构进行路径限制：

```bash
xtract -pattern PubmedArticle -element MedlineCitation/PMID
```

即使对象顺序颠倒，这也能起作用。

### 异构数据

XML 对象可以包含异构混合的组件。例如：

```bash
efetch -db pubmed -id 21433338,17247418 -format xml
```

返回一组书籍和期刊记录的混合体：

```
<PubmedArticleSet>
  <PubmedBookArticle>
    <BookDocument>
    ...
    </PubmedBookData>
  </PubmedBookArticle>
  <PubmedArticle>
    <MedlineCitation>
    ...
    </PubmedData>
  </PubmedArticle>
</PubmedArticleSet>
```

使用 **parent/star** 结构访问各个组件，即使它们可能有不同的名称。将输出通过管道传输到：

```bash
xtract -pattern "PubmedArticleSet/*" -element "*"
```

分别打印每个 XML 组件的全部内容：

```
<PubmedBookArticle><BookDocument> ... </PubmedBookData></PubmedBookArticle>
<PubmedArticle><MedlineCitation> ... </PubmedData></PubmedArticle>
```

使用 parent/child 结构可以隔离在 XML 层次结构中位置不同但名称相同的对象。例如：

```bash
efetch -db pubmed -id 21433338,17247418 -format xml |
xtract -pattern "PubmedArticleSet/*" \
  -group "BookDocument/AuthorList" -tab "\n" -element LastName \
  -group "Book/AuthorList" -tab "\n" -element LastName \
  -group "Article/AuthorList" -tab "\n" -element LastName
```

分别为书籍/章节作者、书籍编辑和文章作者写入单独的行：

```
Fauci        Desrosiers
Coffin       Hughes        Varmus
Lederberg    Cavalli       Lederberg
```

仅使用单个参数进行探索：

```bash
-group BookDocument -block AuthorList -element LastName
```

将访问编辑者（在 BookDocument/Book/AuthorList）以及作者（在 BookDocument/AuthorList），并按 XML 中的出现顺序打印名称：

```
Coffin    Hughes    Varmus    Fauci    Desrosiers
```

（在这个特定示例中，可以使用-if "@Type" -equals authors 或-if "@Type" -equals editors 来区分书籍作者列表，但按 parent/child 进行探索是一种通用的基于位置的方法。）

### 递归定义

某些由 efetch 返回的 XML 对象是递归定义的，包括-db taxonomy 中的 Taxon 和-db gene 中的 Gene-commentary。因此，它们可以包含具有相同 XML 标签的嵌套对象。

检索一组分类记录：

```
efetch -db taxonomy -id 9606,7227 -format xml
```

为每个分类等级生成嵌套的 Taxon 对象的 XML（以下用行引用标记）：

```
    <TaxaSet>
1     <Taxon>
        <TaxId>9606</TaxId>
        <ScientificName>Homo sapiens</ScientificName>
        ...
        <LineageEx>
2         <Taxon>
            <TaxId>131567</TaxId>
            <ScientificName>cellular organisms</ScientificName>
            <Rank>no rank</Rank>
3         </Taxon>
4         <Taxon>
            <TaxId>2759</TaxId>
            <ScientificName>Eukaryota</ScientificName>
            <Rank>superkingdom</Rank>
5         </Taxon>
          ...
        </LineageEx>
        ...
6     </Taxon>
7     <Taxon>
        <TaxId>7227</TaxId>
        <ScientificName>Drosophila melanogaster</ScientificName>
        ...
8     </Taxon>
    </TaxaSet>
```

Xtract 跟踪 XML 对象嵌套，以确定第 1 行的`<Taxon>`开始标签由第 6 行的`</Taxon>`停止标签关闭，而不是第 3 行遇到的第一个`</Taxon>`标签。

当一个递归对象（例如 Taxon）被赋予一个探索命令时：

```bash
efetch -db taxonomy -id 9606,7227,10090 -format xml |
xtract -pattern Taxon \
  -element TaxId ScientificName GenbankCommonName Division
```

随后的-element 命令被阻止进入内部对象，只返回主要条目的信息：

```
9606     Homo sapiens               human          Primates
7227     Drosophila melanogaster    fruit fly      Invertebrates
10090    Mus musculus               house mouse    Rodents
```

使用 **star/child** 结构将跳过外部开始标签：

```bash
efetch -db taxonomy -id 9606,7227,10090 -format xml |
xtract -pattern Taxon -block "*/Taxon" \
  -tab "\n" -element TaxId,ScientificName
```

以单独访问下一级的嵌套对象：

```
131567    cellular organisms
2759      Eukaryota
33154     Opisthokonta
...
```

递归对象可以通过 **double star/child** 结构进行全面探索：

```bash
esearch -db gene -query "DMD [GENE] AND human [ORGN]" |
efetch -format xml |
xtract -pattern Entrezgene -block "**/Gene-commentary" \
  -tab "\n" -element Gene-commentary_type@value,Gene-commentary_accession
```

这将访问每个子对象，不论嵌套深度：

```
genomic    NC_000023
mRNA       XM_006724469
peptide    XP_006724532
mRNA       XM_011545467
peptide    XP_011543769
...
```

### 其他 Elink 选项

Elink 有几个额外的模式，可以用-cmd 参数指定。当不使用默认的"neighbor_history"命令时，elink 将返回一个 eLinkResult XML 对象，每个 UID 的链接分别呈现在单独的块中。例如，"neighbor"命令：

```
esearch -db pubmed -query "Hoffmann PC [AUTH] AND dopamine [MAJR]" |
elink -related -cmd neighbor |
xtract -pattern LinkSetDb -element Id
```

将显示第一列中的原始 PMID 和后续列中的相关文章 PMID：

```
1504781    11754494    3815119    1684029    14614914    12128255    ...
1684029    3815119     1504781    8097798    17161385    14755628    ...
2572612    2903614     6152036    2905789    9483560     1352865     ...
...
```

"acheck"命令返回每条记录的所有可用链接名称：

```bash
esearch -db pubmed -query "Federhen S [AUTH]" |
elink -cmd acheck |
xtract -pattern LinkSet -tab "\n" -element IdLinkSet/Id \
  -block LinkInfo -tab "\n" -element LinkName
```

将每个链接打印在自己的行上：

```
25510495
pubmed_images
pubmed_pmc
pubmed_pmc_local
pubmed_pmc_refs
pubmed_pubmed
pubmed_pubmed_citedin
...
```

"prlinks"命令可以获取文章的发布者网页 URL 引用。Unix "xargs"命令为每个标识符分别调用 elink：

```bash
epost -db pubmed -id 22966225,19880848 |
efetch -format uid |
xargs -n 1 elink -db pubmed -cmd prlinks -id |
xtract -pattern LinkSet -first Id -element ObjUrl/Url
```

### 重新打包 XML 结果

将摘要段落拆分为单个单词，同时使用 XML 重新格式化命令：

```bash
efetch -db pubmed -id 2539356 -format xml |
xtract -stops -rec Rec -pattern PubmedArticle \
  -enc Paragraph -wrp Word -words AbstractText
```

生成：

```
...
<Paragraph>
  <Word>the</Word>
  <Word>tn3</Word>
  <Word>transposon</Word>
  <Word>inserts</Word>
  ...
  <Word>was</Word>
  <Word>necessary</Word>
  <Word>for</Word>
  <Word>immunity</Word>
</Paragraph>
...
```

每个摘要实例中的单词都被封装在一个单独的父对象中。然后可以通过管道传输到：

```bash
xtract -pattern Rec -block Paragraph -num Word
```

计算每个段落的单词数。

### 多步骤转换

虽然 xtract 提供了-element 变体来进行简单的数据操作，但有时将复杂任务分解为一系列简单的转换是最好的方法。这些也称为结构化数据“处理链”。

两个细菌染色体的文档摘要：

```bash
efetch -db nuccore -id U00096,CP002956 -format docsum |
```

包含几个单独的字段和一系列复杂的自闭合 Stat 对象：

```
<DocumentSummary>
  <Id>545778205</Id>
  <Caption>U00096</Caption>
  <Title>Escherichia coli str. K-12 substr. MG1655, complete genome</Title>
  <CreateDate>1998/10/13</CreateDate>
  <UpdateDate>2020/09/23</UpdateDate>
  <TaxId>511145</TaxId>
  <Slen>4641652</Slen>
  <Biomol>genomic</Biomol>
  <MolType>dna</MolType>
  <Topology>circular</Topology>
  <Genome>chromosome</Genome>
  <Completeness>complete</Completeness>
  <GeneticCode>11</GeneticCode>
  <Organism>Escherichia coli str. K-12 substr. MG1655</Organism>
  <Strain>K-12</Strain>
  <BioSample>SAMN02604091</BioSample>
  <Statistics>
    <Stat type="Length" count="4641652"/>
    <Stat type="all" count="9198"/>
    <Stat type="cdregion" count="4302"/>
    <Stat type="cdregion" subtype="CDS" count="4285"/>
    <Stat type="cdregion" subtype="CDS/pseudo" count="17"/>
    <Stat type="gene" count="4609"/>
    <Stat type="gene" subtype="Gene" count="4464"/>
    <Stat type="gene" subtype="Gene/pseudo" count="145"/>
    <Stat type="rna" count="187"/>
    <Stat type="rna" subtype="ncRNA" count="79"/>
    <Stat type="rna" subtype="rRNA" count="22"/>
    <Stat type="rna" subtype="tRNA" count="86"/>
    <Stat source="all" type="Length" count="4641652"/>
    <Stat source="all" type="all" count="13500"/>
    <Stat source="all" type="cdregion" count="4302"/>
    <Stat source="all" type="gene" count="4609"/>
    <Stat source="all" type="prot" count="4302"/>
    <Stat source="all" type="rna" count="187"/>
  </Statistics>
  <AccessionVersion>U00096.3</AccessionVersion>
</DocumentSummary>
<DocumentSummary>
  <Id>342852136</Id>
  <Caption>CP002956</Caption>
  <Title>Yersinia pestis A1122, complete genome</Title>
  ...
```

这使得提取基因计数的“最佳”值成为一项非平凡的任务。

除了将提取值与 XML 标签包装在一起的重新打包命令外，-element "*****"结构打印当前范围的全部内容，包括其 XML 包装。将文档摘要传输到：

```bash
xtract -set Set -rec Rec -pattern DocumentSummary \
  -block DocumentSummary -pkg Common \
    -wrp Accession -element AccessionVersion \
    -wrp Organism -element Organism \
    -wrp Length -element Slen \
    -wrp Title -element Title \
    -wrp Date -element CreateDate \
    -wrp Biomol -element Biomol \
    -wrp MolType -element MolType \
  -block Stat -if @type -equals gene -pkg Gene -element "*" \
  -block Stat -if @type -equals rna -pkg RNA -element "*" \
  -block Stat -if @type -equals cdregion -pkg CDS -element "*" |
```

将几个字段封闭在一个 Common 块中，并将基因、RNA 和编码区特征的统计信息打包到新 XML 对象的单独部分：

```
...
<Rec>
  <Common>
    <Accession>U00096.3</Accession>
    <Organism>Escherichia coli str. K-12 substr. MG1655</Organism>
    <Length>4641652</Length>
    <Title>Escherichia coli str. K-12 substr. MG1655, complete genome</Title>
    <Date>1998/10/13</Date>
    <Biomol>genomic</Biomol>
    <MolType>dna</MolType>
  </Common>
  <Gene>
    <Stat type="gene" count="4609"/>
    <Stat type="gene" subtype="Gene" count="4464"/>
    <Stat type="gene" subtype="Gene/pseudo" count="145"/>
    <Stat source="all" type="gene" count="4609"/>
  </Gene>
  <RNA>
    <Stat type="rna" count="187"/>
    <Stat type="rna" subtype="ncRNA" count="79"/>
    <Stat type="rna" subtype="rRNA" count="22"/>
    <Stat type="rna" subtype="tRNA" count="86"/>
    <Stat source="all" type="rna" count="187"/>
  </RNA>
  <CDS>
    <Stat type="cdregion" count="4302"/>
    <Stat type="cdregion" subtype="CDS" count="4285"/>
    <Stat type="cdregion" subtype="CDS/pseudo" count="17"/>
    <Stat source="all" type="cdregion" count="4302"/>
  </CDS>
</Rec>
...
```

由于来自不同类型特征的统计信息现在被隔离在自己的子结构中，可以使用-first 命令提取每个特征的总计数：

```bash
xtract -set Set -rec Rec -pattern Rec \
  -block Common -element "*" \
  -block Gene -wrp GeneCount -first Stat@count \
  -block RNA -wrp RnaCount -first Stat@count \
  -block CDS -wrp CDSCount -first Stat@count |
```

这将数据重新包装成包含特定特征计数的第三种 XML 格式：

```
...
<Rec>
  <Common>
    <Accession>U00096.3</Accession>
    <Organism>Escherichia coli str. K-12 substr. MG1655</Organism>
    <Length>4641652</Length>
    <Title>Escherichia coli str. K-12 substr. MG1655, complete genome</Title>
    <Date>1998/10/13</Date>
    <Biomol>genomic</Biomol>
    <MolType>dna</MolType>
  </Common>
  <GeneCount>4609</GeneCount>
  <RnaCount>187</RnaCount>
  <CDSCount>4302</CDSCount>
</Rec>
...
```

而不需要在每一步都为 Common 块中的各个元素编写提取命令。

假设内容令人满意，将最后的结构形式传递给：

```bash
xtract \
  -head accession organism length gene_count rna_count \
  -pattern Rec -def "-" \
    -element Accession Organism Length GeneCount RnaCount
```

生成一个带有适当列标题的标签分隔表：

```
accession     organism                 length     gene_count    rna_count
U00096.3      Escherichia coli ...     4641652    4609          187
CP002956.1    Yersinia pestis A1122    4553770    4217          86
```

如果在运行最终的 xtract 后需要不同的字段顺序，可以通过管道传输到：

```
reorder-columns 1 3 5 4
```

将重新排列输出，包括列标题：

```
accession     length     rna_count    gene_count
U00096.3      4641652    187          4609
CP002956.1    4553770    86           4217
```

## 序列记录

### 序列记录的 NCBI 数据模型

NCBI 的序列记录数据模型基于分子生物学的中心法则。序列，包括基因组 DNA、信使 RNA 和蛋白质产物，被“实例化”并分配标识符（例如，登录号）作为参考。

每个序列可以有多个特征，这些特征包含有关给定区域生物学的信息，包括基因表达所涉及的转换。每个特征可以有多个限定符，这些限定符存储有关该特征的具体细节（例如，基因的名称、用于蛋白质翻译的遗传密码、产物序列的登录号、对外部数据库的交叉引用）。

![Image chapter6-Image001.jpg](https://www.ncbi.nlm.nih.gov/books/NBK179288/bin/chapter6-Image001.jpg)

基因特征指示了赋予可测量表型的可遗传核酸区域的位置。基因组 DNA 上的 mRNA 特征表示转录和剪接后保留下来的外显子和非翻译区域。编码区（CDS）特征有一个指向翻译蛋白质的产物参考。

由于信使 RNA 序列并不总是与基因组区域一起提交，CDS 特征（模拟核糖体在转录分子上的移动）传统上注释在基因组序列上，其位置编码外显子区间。

为了用户的便利，限定符可以从基础数据动态生成。因此，即使成熟肽未实例化，也可以从前体蛋白上的 mat_peptide 特征的位置提取成熟肽的序列并显示在/peptide 限定符中。

### INSDSeq XML 中的序列记录

序列记录可以在 GenBank 或 GenPept 平面文件的 XML 版本中检索。查询：

```bash
efetch -db protein -id 26418308,26418074 -format gpc
```

返回一组 INSDSeq 对象：

```
<INSDSet>
  <INSDSeq>
    <INSDSeq_locus>AAN78128</INSDSeq_locus>
    <INSDSeq_length>17</INSDSeq_length>
    <INSDSeq_moltype>AA</INSDSeq_moltype>
    <INSDSeq_topology>linear</INSDSeq_topology>
    <INSDSeq_division>INV</INSDSeq_division>
    <INSDSeq_update-date>03-JAN-2003</INSDSeq_update-date>
    <INSDSeq_create-date>10-DEC-2002</INSDSeq_create-date>
    <INSDSeq_definition>alpha-conotoxin ImI precursor, partial [Conus
       imperialis]</INSDSeq_definition>
    <INSDSeq_primary-accession>AAN78128</INSDSeq_primary-accession>
    <INSDSeq_accession-version>AAN78128.1</INSDSeq_accession-version>
    <INSDSeq_other-seqids>
      <INSDSeqid>gb|AAN78128.1|</INSDSeqid>
      <INSDSeqid>gi|26418308</INSDSeqid>
    </INSDSeq_other-seqids>
    <INSDSeq_source>Conus imperialis</INSDSeq_source>
    <INSDSeq_organism>Conus imperialis</INSDSeq_organism>
    <INSDSeq_taxonomy>Eukaryota; Metazoa; Lophotrochozoa; Mollusca;
       Gastropoda; Caenogastropoda; Hypsogastropoda; Neogastropoda;
       Conoidea; Conidae; Conus</INSDSeq_taxonomy>
    <INSDSeq_references>
      <INSDReference>
      ...
```

生物特征和限定符（此处以 GenPept 格式显示）：

```
FEATURES             Location/Qualifiers
   source          1..17
                   /organism="Conus imperialis"
                   /db_xref="taxon:35631"
                   /country="Philippines"
   Protein         <1..17
                   /product="alpha-conotoxin ImI precursor"
   mat_peptide     5..16
                   /product="alpha-conotoxin ImI"
                   /note="the C-terminal glycine of the precursor is post
                   translationally removed"
                   /calculated_mol_wt=1357
                   /peptide="GCCSDPRCAWRC"
   CDS             1..17
                   /coded_by="AY159318.1:<1..54"
                   /note="nAChR antagonist"
```

在 INSDSeq XML 中表示为结构化对象：

```
...
<INSDFeature>
  <INSDFeature_key>mat_peptide</INSDFeature_key>
  <INSDFeature_location>5..16</INSDFeature_location>
  <INSDFeature_intervals>
    <INSDInterval>
      <INSDInterval_from>5</INSDInterval_from>
      <INSDInterval_to>16</INSDInterval_to>
      <INSDInterval_accession>AAN78128.1</INSDInterval_accession>
    </INSDInterval>
  </INSDFeature_intervals>
  <INSDFeature_quals>
    <INSDQualifier>
      <INSDQualifier_name>product</INSDQualifier_name>
      <INSDQualifier_value>alpha-conotoxin ImI</INSDQualifier_value>
    </INSDQualifier>
    <INSDQualifier>
      <INSDQualifier_name>note</INSDQualifier_name>
      <INSDQualifier_value>the C-terminal glycine of the precursor is
         post translationally removed</INSDQualifier_value>
    </INSDQualifier>
    <INSDQualifier>
      <INSDQualifier_name>calculated_mol_wt</INSDQualifier_name>
      <INSDQualifier_value>1357</INSDQualifier_value>
    </INSDQualifier>
    <INSDQualifier>
      <INSDQualifier_name>peptide</INSDQualifier_name>
      <INSDQualifier_value>GCCSDPRCAWRC</INSDQualifier_value>
    </INSDQualifier>
  </INSDFeature_quals>
</INSDFeature>
...
```

使用 **-pattern** {sequence} **-group** {feature} **-block** {qualifier} 结构可以轻松探索数据层次结构。然而，特征和限定符名称在数据值中表示，而不是 XML 元素标签中，因此需要 -if 和 -equals 来选择所需的对象和内容。

### 生成限定符提取命令

为了方便探索序列记录，xtract **-insd** 辅助功能从命令行中的特征和限定符名称生成适当的嵌套提取命令。（两个计算限定符，**sub_sequence** 和 **feat_location**，也受到支持。）

在独立命令中运行 xtract -insd 会打印一个新的 xtract 语句，然后可以将其复制、必要时编辑并粘贴到其他查询中。在多步骤管道中运行 -insd 命令会动态执行自动构建的查询。

提供可选的（完整/部分）位置指示、特征键以及一个或多个限定符名称：

```bash
xtract -insd complete mat_peptide product peptide
```

创建一个新的 xtract 语句，该语句将生成具有完整位置的成熟肽特征的限定符值表。该语句以记录登录号和查找指定类型特征的指令开头：

```bash
xtract -pattern INSDSeq -ACCN INSDSeq_accession-version -SEQ INSDSeq_sequence \
  -group INSDFeature -if INSDFeature_key -equals mat_peptide \
    -branch INSDFeature -unless INSDFeature_partial5 -or INSDFeature_partial3 \
      -clr -pfx "\n" -element "&ACCN" \
```

然后每个限定符生成自定义提取代码，并附加到不断增长的查询中。例如：

```bash
-block INSDQualifier \
  -if INSDQualifier_name -equals product \
    -element INSDQualifier_value
```

### 蜗牛毒素肽序列

在一个关于锥蜗牛毒素的搜索中结合 xtract -insd 命令：

```bash
esearch -db pubmed -query "conotoxin" |
elink -target protein |
efilter -query "mat_peptide [FKEY]" |
efetch -format gpc |
xtract -insd complete mat_peptide "%peptide" product mol_wt peptide |
```

# 范例神经毒素肽的表格输出及其过滤与处理步骤

## 表格内容

以下是神经毒素肽样本的表格数据，包含了登录号、成熟肽长度、产品名称、计算分子量和氨基酸序列：

```
AAN78128.1    12    alpha-conotoxin ImI    1357    GCCSDPRCAWRC
ADB65789.1    20    conotoxin Cal 16       2134    LEMQGCVCNANAKFCCGEGR
ADB65788.1    20    conotoxin Cal 16       2134    LEMQGCVCNANAKFCCGEGR
AGO59814.1    32    del13b conotoxin       3462    DCPTSCPTTCANGWECCKGYPCVRQHCSGCNH
AAO33169.1    16    alpha-conotoxin GIC    1615    GCCSHPACAGNNQHIC
AAN78279.1    21    conotoxin Vx-II        2252    WIDPSHYCCCGGGCTDDCVNC
AAF23167.1    31    BeTX toxin             3433    CRAEGTYCENDSQCCLNECCWGGCGHPCRHP
ABW16858.1    15    marmophin              1915    DWEYHAHPKPNSFWT
...
```

## 使用 Unix 命令和 EDirect 脚本进行数据处理

以下是通过一系列 Unix 命令和 EDirect 脚本对表格数据进行过滤和处理的步骤：

```bash
grep -i conotoxin |
filter-columns '10 <= $2 && $2 <= 30' |
sort-table -u -k 5 |
sort-table -k 2,2n |
align-columns -
```

此命令流程实现以下功能：

1. 通过产品名称过滤，保留包含“conotoxin”的行。
2. 限制结果在指定的肽长度范围内（10 到 30 之间）。
3. 去除重复的序列。
4. 按肽长度排序表格。
5. 对齐列以获得更清晰的打印输出。

处理后的表格如下：

```
AAN78127.1    12    alpha-conotoxin ImII             1515    ACCSDRRCRWRC
AAN78128.1    12    alpha-conotoxin ImI              1357    GCCSDPRCAWRC
ADB43130.1    15    conotoxin Cal 1a                 1750    KCCKRHHGCHPCGRK
ADB43131.1    15    conotoxin Cal 1b                 1708    LCCKRHHGCHPCGRT
AAO33169.1    16    alpha-conotoxin GIC              1615    GCCSHPACAGNNQHIC
ADB43128.1    16    conotoxin Cal 5.1                1829    DPAPCCQHPIETCCRR
AAD31913.1    18    alpha A conotoxin Tx2            2010    PECCSHPACNVDHPEICR
ADB43129.1    18    conotoxin Cal 5.2                2008    MIQRSQCCAVKKNCCHVG
ADB65789.1    20    conotoxin Cal 16                 2134    LEMQGCVCNANAKFCCGEGR
ADD97803.1    20    conotoxin Cal 1.2                2206    AGCCPTIMYKTGACRTNRCR
AAD31912.1    21    alpha A conotoxin Tx1            2304    PECCSDPRCNSSHPELCGGRR
AAN78279.1    21    conotoxin Vx-II                  2252    WIDPSHYCCCGGGCTDDCVNC
ADB43125.1    22    conotoxin Cal 14.2               2157    GCPADCPNTCDSSNKCSPGFPG
ADD97802.1    23    conotoxin Cal 6.4                2514    GCWLCLGPNACCRGSVCHDYCPR
AAD31915.1    24    O-superfamily conotoxin TxO2     2565    CYDSGTSCNTGNQCCSGWCIFVCL
AAD31916.1    24    O-superfamily conotoxin TxO3     2555    CYDGGTSCDSGIQCCSGWCIFVCF
AAD31920.1    24    omega conotoxin SVIA mutant 1    2495    CRPSGSPCGVTSICCGRCYRGKCT
AAD31921.1    24    omega conotoxin SVIA mutant 2    2419    CRPSGSPCGVTSICCGRCSRGKCT
ABE27006.1    25    conotoxin p114a                  2917    FPRPRICNLACRAGIGHKYPFCHCR
ABE27007.1    25    conotoxin p114.1                 2645    GPGSAICNMACRLGQGHMYPFCNCN
...
```

## 使用 xtract 的-insdx 变体

```bash
esearch -db protein -query "conotoxin" |
efilter -query "mat_peptide [FKEY]" |
efetch -format gpc |
xtract -insdx complete mat_peptide "%peptide" product mol_wt peptide |
xtract -pattern Rec -select product -contains conotoxin |
xtract -pattern Rec -sort mol_wt
```

将输出表格直接保存为 XML 格式，XML 标签名取自原始的限定符名：

```
... 
  <Rec>
  <accession>AAO33169.1</accession>
  <feature_key>mat_peptide</feature_key>
  <peptide_Len>16</peptide_Len>
  <product>alpha-conotoxin GIC</product>
  <mol_wt>1615</mol_wt>
  <peptide>GCCSHPACAGNNQHIC</peptide>
</Rec>
<Rec>
  <accession>AIC77099.1</accession>
  <feature_key>mat_peptide</feature_key>
  <peptide_Len>16</peptide_Len>
  <product>conotoxin Im1.2</product>
  <mol_wt>1669</mol_wt>
  <peptide>GCCSHPACNVNNPHIC</peptide>
</Rec>
...
```

使用前缀快捷方式“**#**”和“**%**”的限定符名将被修改为使用“_Num”和“_Len”后缀。

### 缺少限定符的处理

对于缺少特定限定符的记录：

```bash
esearch -db protein -query "RAG1 [GENE] AND Mus musculus [ORGN]" |
efetch -format gpc |
xtract -insd source organism strain |
sort-table -u -k 2,3
```

将插入破折号作为占位符：

```
P15919.2       Mus musculus               -
AAO61776.1     Mus musculus               129/Sv
NP_033045.2    Mus musculus               C57BL/6
EDL27655.1     Mus musculus               mixed
BAD69530.1     Mus musculus castaneus     -
BAD69531.1     Mus musculus domesticus    BALB/c
BAD69532.1     Mus musculus molossinus    MOA
```

## 序列坐标

### 基因位置

理解序列坐标约定对于使用基因位置检索对应染色体子区域（通过 efetch 或 UCSC 浏览器）是必要的。

以 GenBank 或 GenPept 格式显示的序列记录使用“基于 1”的坐标系统，序列位置编号从“1”开始：

```
  1 catgccattc gttgagttgg aaacaaactt gccggctagc cgcatacccg cggggctgga
 61 gaaccggctg tgtgcggcca cagccaccat cctggacaaa cccgaagacg tgagtgaggg
121 tcggcgagaa cttgtgggct agggtcggac ctcccaatga cccgttccca tccccaggga
181 ccccactccc ctggtaacct ctgaccttcc gtgtcctatc ctcccttcct agatcccttc
...
```

在这种约定下，位置指的是序列字母本身：

```
C   A   T   G   C   C   A   T   T   C
1   2   3   4   5   6   7   8   9  10
```

最后一个碱基或残基的位置等于序列的长度。上图中的 ATG 起始密码子在位置 2 到 4（包含在内）。

对于计算机程序而言，使用“基于 0”的坐标系统可以简化序列位置计算的算术运算。0 基表示法中的 ATG 密码子在位置 1 到 3。（UCSC 浏览器使用的是一种混合的半开放表示法，起始位置是基于 0 的，而终止位置是基于 1 的。）

NCBI 的软件通常会在输入时将位置转换为基于 0 的坐标，执行所需的计算，然后将结果转换为基于 1 的表示进行显示。这些转换只需简单地从基于 1 的值中减去 1，或将基于 0 的值加 1。

### 坐标转换

检索特定基因的文档摘要：

```bash
esearch -db gene -query "BRCA2 [GENE] AND human [ORGN]" |
efetch -format docsum |
```

返回该基因的染色体位置，以“基于 0”的坐标表示：

```
...
<GenomicInfoType>
  <ChrLoc>13</ChrLoc>
  <ChrAccVer>NC_000013.11</ChrAccVer>
  <ChrStart>32315479</ChrStart>
  <ChrStop>32399671</ChrStop>
  <ExonCount>27</ExonCount>
</GenomicInfoType>
...
```

将文档摘要传递给 xtract 命令，并使用‑element：

```bash
xtract -pattern GenomicInfoType -element ChrAccVer ChrStart ChrStop
```

获取登录号和基于 0 的坐标值：

```
NC_000013.11    32315479    32399671
```

Efetch 有 **‑seq_start** 和 **‑seq_stop** 参数来检索基因片段，但这些参数需要 1 基坐标范围。

为了解决这个问题，创建了两个额外的 efetch 参数，**‑chr_start** 和 **‑chr_stop**，以允许直接使用基于 0 的坐标：

```bash
efetch -db nuccore -format gb -id NC_000013.11 \
  -chr_start 32315479 -chr_stop 32399671
```

Xtract 现在有数字提取命令来帮助进行坐标转换。选择带有‑inc 参数的字段：

```bash
xtract -pattern GenomicInfoType -element ChrAccVer -inc ChrStart ChrStop
```

获取登录号和基于 0 的坐标，然后递增位置以生成基于 1 的值：

```
NC_000013.11    32315480    32399672
```

EDirect 提供了所有相关 Entrez 数据库（例如 gene，snp，dbvar）中序列位置的政策，并提供了将这些坐标转换为其他约定的快捷方式。例如：

```bash
xtract -pattern GenomicInfoType -element ChrAccVer -1-based ChrStart ChrStop
```

它理解基因文档摘要中的 ChrStart 和 ChrStop 字段是基于 0 的，看到所需输出是基于 1 的，并使用‑inc 逻辑内部转换坐标。同样的：

```bash
-element ChrAccVer -ucsc-based ChrStart ChrStop
```

将 0 基的起始值保持不变，但增加原始的停止值以生成可以传递给 UCSC 浏览器的半开放形式：

```
NC_000013.11    32315479    32399672
```

## 基因记录

### 区域中的基因

要列出位于人类 X 染色体着丝粒两侧标记之间的所有基因，首先检索该染色体上的编码蛋白基因记录：

```bash
esearch -db gene -query "Homo sapiens [ORGN] AND X [CHR]" |
efilter -status alive -type coding | efetch -format docsum |
```

通过将记录传递给以下命令来提取基因名称和染色体位置：

```bash
xtract -pattern DocumentSummary -NAME Name -DESC Description \
  -block GenomicInfoType -if ChrLoc -equals X \
    -min ChrStart,ChrStop -element "&NAME" "&DESC" |
```

需要探索每个 GenomicInfoType，因为 X 和 Y 染色体末端有伪常染色体区域：

```
...
<GenomicInfo>
  <GenomicInfoType>
    <ChrLoc>X</ChrLoc>
    <ChrAccVer>NC_000023.11</ChrAccVer>
    <ChrStart>155997630</ChrStart>
    <ChrStop>156013016</ChrStop>
    <ExonCount>14</ExonCount>
  </GenomicInfoType>
  <GenomicInfoType>
    <ChrLoc>Y</ChrLoc>
    <ChrAccVer>NC_000024.10</ChrAccVer>
    <ChrStart>57184150</ChrStart>
    <ChrStop>57199536</ChrStop>
    <ExonCount>14</ExonCount>
  </GenomicInfoType>
</GenomicInfo>
...
```

如果不限制到 X 染色体，接近 Y 染色体“q”端的 IL9R 副本将错误地与接近 X 染色体着丝粒的基因放在一起，如下所示在 SPIN2A 和 ZXDB 之间：

```
...
57121860    FAAH2     fatty acid amide hydrolase 2
57133042    SPIN2A    spindlin family member 2A
57184150    IL9R      interleukin 9 receptor
57592010    ZXDB      zinc finger X-linked duplicated B
...
```

在基因限制为 X 染色体之后，结果可以按位置排序，然后过滤和划分：

```bash
sort-table -k 1,1n | cut -f 2- |
grep -v pseudogene | grep -v uncharacterized | grep -v hypothetical |
between-two-genes AMER1 FAAH2
```

生成位于两个标记之间的已知基因的有序表：

```
FAAH2      fatty acid amide hydrolase 2
SPIN2A     spindlin family member 2A
ZXDB       zinc finger X-linked duplicated B
NLRP2B     NLR family pyrin domain containing 2B
ZXDA       zinc finger X-linked duplicated A
SPIN4      spindlin family member 4
ARHGEF9    Cdc42 guanine nucleotide exchange factor 9
AMER1      APC membrane recruitment protein 1
```

### 基因序列

编码在序列负链上的基因：

```bash
esearch -db gene -query "DDT [GENE] AND mouse [ORGN]" |
efetch -format docsum |
xtract -pattern GenomicInfoType -element ChrAccVer ChrStart ChrStop |
```

其坐标（文档摘要中的“基于 0”）的起始位置大于终止位置：

```
NC_000076.6    75773373    75771232
```

可以通过“while”循环将这些值读取到 Unix 变量中：

```bash
while IFS=$'\t' read acn str stp
do
  efetch -db nuccore -format gb \
    -id "$acn" -chr_start "$str" -chr_stop "$stp"
done
```

然后可以使用这些变量以 GenBank 格式获取反向互补子区域：

```
LOCUS       NC_000076               2142 bp    DNA     linear   CON 08-AUG-2019
DEFINITION  Mus musculus strain C57BL/6J chromosome 10, GRCm38.p6 C57BL/6J.
ACCESSION   NC_000076 REGION: complement(75771233..75773374)
...
   gene            1..2142
                   /gene="Ddt"
   mRNA            join(1..159,462..637,1869..2142)
                   /gene="Ddt"
                   /product="D-dopachrome tautomerase"
                   /transcript_id="NM_010027.1"
   CDS             join(52..159,462..637,1869..1941)
                   /gene="Ddt"
                   /codon_start=1
                   /product="D-dopachrome decarboxylase"
                   /protein_id="NP_034157.1"
                   /translation="MPFVELETNLPASRIPAGLENRLCAATATILDKPEDRVSVTIRP
                   GMTLLMNKSTEPCAHLLVSSIGVVGTAEQNRTHSASFFKFLTEELSLDQDRIVIRFFP
                   ...
```

可以通过 efetch ‑revcomp 选择正链序列范围的反向互补。

## 外部数据

### 查询外部服务

nquire 程序使用命令行参数从 RESTful、CGI 或 FTP 服务器获取数据。查询由命令行参数组成。路径可以分为组件，并用斜杠组合。剩余的参数（以破折号开头）是标记/值对，标记之间的多个值用逗号组合。

例如，一个 POST 请求：

```bash
nquire -url http://w1.weather.gov/xml/current_obs/KSFO.xml |
xtract -pattern current_observation -tab "\n" \
  -element weather temp_f wind_dir wind_mph
```

返回旧金山机场的当前天气报告：

```
A Few Clouds
54.0
Southeast
5.8
```

GET 查询：

```bash
nquire -get http://collections.mnh.si.edu/services/resolver/resolver.php \
  -voucher "Birds:321082" |
xtract -pattern Result -tab "\n" -element ScientificName StateProvince Country
```

返回红喉蜂鸟标本的信息：

```
Archilochus colubris
Maryland
United States
```

而 FTP 请求：

```bash
nquire -ftp ftp.ncbi.nlm.nih.gov pub/gdp ideogram_9606_GCF_000001305.14_850_V1 |
grep acen | cut -f 1,2,6,7 | awk '/^X\t/'
```

返回人类 X 染色体着丝粒的（估计）序列坐标数据（显示 p 臂和 q 臂的交界处）：

```
X    p    58100001    61000000
X    q    61000001    63800000
```

Nquire 还可以生成 FTP 服务器目录中的文件列表：

```bash
nquire -lst ftp://nlmpubs.nlm.nih.gov online/mesh/MESH_FILES/xmlmesh
```

或者生成 FTP 文件名的列表，并在文件名前加上文件大小的列：

```bash
nquire -dir ftp.ncbi.nlm.nih.gov gene/DATA
```

最后，nquire 可以将 FTP 文件下载到本地磁盘：

```bash
nquire -dwn ftp.nlm.nih.gov online/mesh/MESH_FILES/xmlmesh desc2021.zip
```

如果安装了 Aspera Connect，nquire ‑asp 命令将提供更快的从 NCBI 服务器检索的速度：

```bash
nquire -asp ftp.ncbi.nlm.nih.gov pubmed baseline pubmed22n0001.xml.gz
```

没有 Aspera Connect 时，nquire ‑asp 会默认使用‑dwn 逻辑。

### XML 命名空间

命名空间前缀后跟一个冒号，而前导冒号匹配任何前缀：

```bash
nquire -url http://webservice.wikipathways.org getPathway -pwId WP455 |
xtract -pattern "ns1:getPathwayResponse" -decode ":gpml" |
```

然后可以处理嵌入的图形路径标记语言对象：

```bash
xtract -pattern Pathway -block Xref \
  -if @Database -equals "Entrez Gene" \
    -tab "\n" -element @ID
```

### 自动 Xtract 格式转换

Xtract 现在可以检测并转换 JSON、文本 ASN.1 和 GenBank/GenPept 平面文件格式的输入数据。以下描述的 transmute 命令或快捷脚本仅在您想要检查中间 XML 或覆盖默认转换设置时需要。

### JSON 数组

从斯克里普斯研究所开发的生物数据库服务中检索的人类β-珠蛋白的综合基因信息：

```bash
nquire -get http://mygene.info/v3 gene 3043 |
```

包含一个多维数组的外显子坐标，格式为 JavaScript 对象表示法（JSON）：

```
"position": [
  [
    5225463,
    5225726
  ],
  [
    5226576,
    5226799
  ],
  [
    5226929,
    5227071
  ]
],
"strand": -1,
```

可以使用 transmute **‑j2x**（或快捷脚本 **json2xml**）转换为 XML：

```bash
transmute -j2x |
```

默认的"**‑nest** element"参数为每个级别分配不同的标签名称：

```
<position>
  <position_E>5225463</position_E>
  <position_E>5225726</position_E>
</position>
...
```

### JSON 混合

查询人类绿敏感视蛋白基因：

```bash
nquire -get http://mygene.info/v3/gene/2652 |
transmute -j2x |
```

返回的数据包含路径部分的异构对象混合：

```
<pathway>
  <reactome>
    <id>R-HSA-162582</id>
    <name>Signal Transduction</name>
  </reactome>
  ...
  <wikipathways>
    <id>WP455</id>
    <name>GPCRs, Class A Rhodopsin-like</name>
  </wikipathways>
</pathway>
```

使用父对象/星号构造可以访问父对象的各个组件，而无需明确指定它们的名称。对于打印，子对象的名称由问号表示：

```bash
xtract -pattern opt -group "pathway/*" \
  -pfc "\n" -element "?,name,id"
```

这将显示路径数据库引用的表格：

```
reactome        Signal Transduction                R-HSA-162582
reactome        Disease                            R-HSA-1643685
...
reactome        Diseases of the neuronal system    R-HSA-9675143
wikipathways    GPCRs, Class A Rhodopsin-like      WP455
```

Xtract **‑path** 可以使用由点或斜杠分隔的多级对象地址进行探索：

```bash
xtract -pattern opt -path pathway.wikipathways.id -tab "\n" -element id
```

### ASN.1 转换

类似于‑j2x，transmute **‑a2x**（或 **asn2xml**）将 Abstract Syntax Notation 1（ASN.1）文本文件转换为 XML。

### 表格到 XML

使用 transmute **‑t2x**（或 **tbl2xml**）可以轻松将制表符分隔的文件转换为 XML：

```bash
nquire -ftp ftp.ncbi.nlm.nih.gov gene/DATA gene_info.gz |
gunzip -c | grep -v NEWENTRY | cut -f 2,3 |
transmute -t2x -set Set -rec Rec -skip 1 Code Name
```

这会接受一系列命令行参数，使用标签名来包装各个列，并跳过包含标题信息的第一行输入，生成一个新的 XML 文件：

```
...
<Rec>
  <Code>1246500</Code>
  <Name>repA1</Name>
</Rec>
<Rec>
  <Code>1246501</Code>
  <Name>repA2</Name>
</Rec>
...
```

transmute ‑t2x **‑header** 参数将从文件的第一行获取标签名：

```bash
nquire -ftp ftp.ncbi.nlm.nih.gov gene/DATA gene_info.gz |
gunzip -c | grep -v NEWENTRY | cut -f 2,3 |
transmute -t2x -set Set -rec Rec -header
```

### CSV 到 XML

类似于‑t2x，transmute **‑c2x**（或 **csv2xml**）将逗号分隔值（CSV）文件转换为 XML。

### GenBank 下载

整个 GenBank 格式发布文件集可以通过以下方式下载：

```bash
fls=$( nquire -lst ftp.ncbi.nlm.nih.gov genbank )
for div in \
  bct con env est gss htc htg inv mam pat \
  phg pln pri rod sts syn tsa una vrl vrt
do
  echo "$fls" |
  grep ".seq.gz" | grep "gb${div}" |
  sort -V | skip-if-file-exists |
  nquire -asp ftp.ncbi.nlm.nih.gov genbank
done
```

可以从"for"循环中移除不需要的分区，以限制检索到特定的测序类别或分类区域。

### GenBank 到 XML

最新的 GenBank 病毒发布文件也可以从 NCBI 服务器下载：

```bash
nquire -lst ftp.ncbi.nlm.nih.gov genbank |
grep "^gbvrl" | grep ".seq.gz" | sort -V |
tail -n 1 | skip-if-file-exists |
nquire -asp ftp.ncbi.nlm.nih.gov genbank
```

可以通过生物体名称或分类标识符，或通过存在或不存在的任意文本字符串，选择 GenBank 平面文件记录，并使用 transmute **‑gbf**（或 **filter-genbank**）进行筛选：

```bash
gunzip -c *.seq.gz | filter-genbank -taxid 11292 |
```

由于 xtract 现在可以读取 JSON、ASN.1 和 GenBank 格式，可以将筛选后的平面文件传递给 xtract 以获取各个编码区域的特征位置间隔和底层序列：

```bash
xtract -insd CDS gene product feat_location sub_sequence
```

无需明确的 transmute **‑g2x**（或 **gbf2xml**）步骤。

### GenPept 到 XML

最新的 GenPept 每日增量更新文件可以下载：

```bash
nquire -ftp ftp.ncbi.nlm.nih.gov genbank daily-nc Last.File |
sed "s/flat/gnp/g" |
nquire -ftp ftp.ncbi.nlm.nih.gov genbank daily-nc |
gunzip -c | transmute -g2x |
```

并且提取的 INSDSeq XML 可以以类似的方式处理：

```bash
xtract -pattern INSDSeq -select INSDQualifier_value -equals "taxon:2697049" |
xtract -insd mat_peptide product sub_sequence
```

## 本地 PubMed 缓存

当需要获取几千条记录时，从 Entrez 获取数据效果良好，但对于更大规模的数据集，下载时间会成为一个限制因素。

最近的技术进步提供了一种经济实惠且实用的替代方案。高性能 NVMe 固态硬盘（消除了文件访问和记账操作的旋转延迟）现在可以轻松购买到。现代高容量文件系统，如 APFS（使用 64 位 inode）或 Ext4（可以配置为 1 亿个 inode），在当今的计算机上已经很普遍。多层嵌套目录的谨慎安排（每个目录不超过 100 个子文件夹或记录文件）确保了这些增强功能的最大效率利用。

这些功能的结合允许本地记录存储（预先从 PubMed FTP 发布文件中填充）成为按需网络检索的有效替代方案，同时避免了在计算机上安装和支持传统数据库产品的需要。

### 随机访问存档

EDirect 现在可以将超过 3500 万条活跃的 PubMed 记录预加载到价格便宜的外部 500 GB（千兆字节）固态硬盘上作为单个文件，以便快速检索。例如，PMID 2539356 将存储在：

```
/pubmed/Archive/02/53/93/2539356.xml.gz
```

使用文件夹层次结构来组织数据，以便随机访问任何记录。

本地存档是一个完全自包含的一站式系统，用户无需下载、配置和维护复杂的第三方数据库软件。

在您的配置文件中设置一个环境变量以引用外部驱动器的一部分：

```bash
export EDIRECT_LOCAL_ARCHIVE=/Volumes/external_drive_name/
```

或者设置单独的环境变量，以便将中间步骤保存在外部 SSD 上，但将结果存档保存在计算机内部存储的指定区域：

```bash
export EDIRECT_LOCAL_ARCHIVE=$HOME/internal_directory_name/
export EDIRECT_LOCAL_WORKING=/Volumes/external_drive_name/
```

在这种情况下，本地存档将在内部驱动器上存储大约 180 GB，或者如果也构建了本地搜索索引（见下文），则最多存储 250 GB。

然后运行 **archive-pubmed** 来下载 PubMed 发布文件并将每个记录分发到驱动器上。这个过程需要几个小时才能完成，但随后的更新是增量更新，应该在几分钟内完成。

从本地存档中检索超过 125,000 条压缩的 PubMed 记录：

```bash
esearch -db pubmed -query "PNAS [JOUR]" -pub abstract |
efetch -format uid | stream-pubmed | gunzip -c |
```

大约需要 20 秒钟。从 NCBI 的网络服务中使用 efetch ‑format xml 检索这些记录大约需要 40 分钟。

即使是适度的 PubMed 查询结果集也能从使用本地缓存中受益。对 191 篇论文进行反向引用查找：

```bash
esearch -db pubmed -query "Cozzarelli NR [AUTH]" | elink -cited |
```

需要 13 秒钟来匹配 9620 篇后续文章。从本地存档中检索它们：

```bash
efetch -format uid | fetch-pubmed |
```

不到一秒钟即可完成。打印这些记录中所有作者的名字：

```bash
xtract -pattern PubmedArticle -block Author \
  -sep " " -tab "\n" -element LastName,Initials |
```

允许创建一个频率表：

```bash
sort-uniq-count-rank
```

列出最常引用原始论文的作者：

```
145    Cozzarelli NR
108    Maxwell A
86     Wang JC
81     Osheroff N
...
```

从网络服务中获取将使运行时间从 14 秒延长到超过 2 分钟。

### 本地搜索索引

类似的分而治之策略用于创建适合大型数据挖掘查询的本地信息检索系统。运行 **archive-pubmed ‑index** 从存储在本地存档中的记录中填充检索索引文件。初始索引也需要几个小时。由于 PubMed 更新每天发布一次，可能方便在晚上开始重新索引并在夜间运行。

对于 PubMed 标题和主要摘要，索引过程在特定前缀后删除连字符，去除重音符号和变音符号，在标点符号处拆分单词，纠正编码伪影，并拼写出希腊字母，以便于科学术语的搜索。然后，它准备带有术语位置的倒排索引，并使用它们构建分布式术语列表和发布文件。

例如，包含“cancer”一词的术语列表在标题或摘要中将位于：

```
/pubmed/Postings/TIAB/c/a/n/c/canc.TIAB.trm
```

因此，对癌症的查询只需要加载总索引的很小一部分。软件支持表达式评估、通配符截断、短语查询和接近搜索。

**phrase-search** 脚本（隐含 **‑db pubmed**）提供对本地搜索系统的访问。

显示索引字段名称、特定字段的所有术语，以及术语加记录计数：

```bash
phrase-search -fields

phrase-search -terms TITL

phrase-search -totals PROP
```

术语用尾随星号截断，可以扩展以显示单个发布计数：

```bash
phrase-search -count "catabolite repress*"

phrase-search -counts "catabolite repress*"
```

查询评估包括布尔操作和括号表达式：

```bash
phrase-search -query "(literacy AND numeracy) NOT (adolescent OR child)"
```

查询中的相邻单词被视为连续短语：

```bash
phrase-search -query "selective serotonin reuptake inhibitor"
```

每个加号将替换短语中的一个单词，连续的波浪号表示连续短语之间的最大距离：

```bash
phrase-search -query "vitamin c + + common cold"

phrase-search -query "vitamin c ~ ~ common cold"
```

精确子字符串匹配，无需布尔运算符或索引字段名称的特殊处理，可以通过-title（在文章标题上）或-exact（在标题或摘要上）获得，而任何字段的部分术语匹配通过-match 提供：

```bash
phrase-search -title "Genetic Control of Biochemical Reactions in Neurospora."

phrase-search -match "tn3 transposition immunity [PAIR]" | just-top-hits 1
```

MeSH 标识符代码、MeSH 层次结构键和出版年份也被索引，并且通过内部映射到适当的 CODE 或 TREE 条目来支持 MESH 字段查询：

```bash
phrase-search -query "C14.907.617.812* [TREE] AND 2015:2019 [YEAR]"

phrase-search -query "Raynaud Disease [MESH]"
```

所有查询命令返回一个 PMID 列表，可以直接传递给 **fetch-pubmed** 以检索未压缩的记录。例如：

```bash
phrase-search -query "selective serotonin ~ ~ ~ reuptake inhibit*" |
fetch-pubmed |
xtract -pattern PubmedArticle -num AuthorList/Author |
sort-uniq-count -n |
reorder-columns 2 1 |
head -n 25 |
align-columns -g 4 -a lr
```

进行动态通配符扩展的接近搜索（匹配短语如“selective serotonin and norepinephrine reuptake inhibitors”）并从本地存档中获取 12,966 条 PubMed 记录。然后统计每篇论文的作者数量（一个联盟被视为一个作者），打印每个作者数量对应的论文数量频率表：

```
0      51
1    1382
2    1897
3    1906
...
```

phrase-search 和 fetch-pubmed 脚本是 **rchive** 程序的前端，后者用于构建和搜索倒排检索系统。Rchive 是多线程的，以提高速度，从本地存档中并行检索记录，并在评估标题词作为连续短语之前并行获取所有术语的位置索引。

可以通过运行年度记录计数的累加和来计算 PubMed 的累积规模。在半对数图上，随时间呈指数增长将表现为大致线性的曲线：

```bash
phrase-search -totals YEAR |
print-columns '$2, $1, total += $1' |
print-columns '$1, log($2)/log(10), log($3)/log(10)' |
filter-columns '$1 >= 1800 && $1 < YR' |
xy-plot annual-and-cumulative.png
```

### 自然语言处理

NCBI 的生物医学文本挖掘小组执行计算分析，以从文章内容中提取化学、疾病和基因参考。NLM 对 PubMed 记录的索引分配了基因功能参考（GeneRIF）映射。

定期运行 **archive-ncbinlp ‑index**（每月）将自动刷新任何过期的支持文件，然后索引 CHEM、DISZ、GENE 和几个基因子字段（GRIF、GSYN 和 PREF）中的连接：

```bash
phrase-search -terms DISZ | grep -i Raynaud

phrase-search -counts "Raynaud* [DISZ]"

phrase-search -query "Raynaud Disease [DISZ]"
```

### 跟踪引用链接

运行 **archive-nihocc ‑index** 将下载最新的 NIH 开放引用集合月度发布，并构建 CITED 和 CITES 索引，相当于本地的 elink ‑cited 和‑cites 命令。

通过将一个或多个 PMID 传递给 phrase-search **‑link** 来检索引用链接：

```bash
phrase-search -db pubmed -query "Havran W* [AUTH]" |
phrase-search -link CITED |
```

这将返回 6504 篇引用原始 96 篇论文的文章的 PMID。然后获取并分析这些记录：

```bash
fetch-pubmed |
xtract -pattern PubmedArticle -histogram Journal/ISOAbbreviation |
sort-table -nr | head -n 10
```

显示后续文章发表的最受欢迎的期刊：

```
921    J Immunol
293    Eur J Immunol
248    J Exp Med
168    Front Immunol
149    Proc Natl Acad Sci U S A
139    Cell Immunol
121    Int Immunol
106    J Invest Dermatol
105    Immunol Rev
99     Immunity
```

### 快速扫描 PubMed

如果运行 **expand-current** 脚本，可以对非冗余的活跃 PubMed 记录集进行临时扫描：

```bash
cat $EDIRECT_LOCAL_WORKING/pubmed/Scratch/Current/*.xml |
xtract -timer -turbo -pattern PubmedArticle -PMID MedlineCitation/PMID \
  -group AuthorList -if "#LastName" -eq 7 -element "&PMID" LastName
```

发现 1,700,652 篇有七位作者的文章。（此查询排除了联盟和其他命名的研究人员。作者数量现在在 ANUM 字段中索引。）

Xtract 使用 Boyer-Moore-Horspool 算法将 XML 流分割成单独的记录，将它们分发给多个数据探索和提取函数实例并行执行。具有固态硬盘的多核计算机可以在不到 4 分钟内处理所有的 PubMed 记录。

expand-current 脚本现在调用 xtract -index 在每条 PubMed 记录之前放置一个 XML 大小对象：

```
...
</PubmedArticle>
<NEXT_RECORD_SIZE>6374</NEXT_RECORD_SIZE>
<PubmedArticle>
...
```

xtract **‑turbo** 标志读取此预先计算的信息，以大约将记录分割速度提高一倍，这是在许多 CPU 核心可用时的速率限制步骤。通过适当的冷却，应该允许多达十几个核心对批量数据提取吞吐量做出贡献。

### 用户指定的术语索引

运行 **custom-index** 与 PubMed 索引器脚本和它填充的字段名称：

```bash
custom-index $( which idx-grant ) GRNT
```

将用户指定的索引集成到本地搜索系统中。**idx-grant** 脚本：

```bash
xtract -set IdxDocumentSet -rec IdxDocument -pattern PubmedArticle \
  -wrp IdxUid -element MedlineCitation/PMID -clr -rst -tab "" \
  -group PubmedArticle -pkg IdxSearchFields \
    -block PubmedArticle -wrp GRNT -element Grant/GrantID
```

在其前三行中具有可重用的样板，并按资助标识符索引 PubMed 记录：

```
...
<IdxDocument>
  <IdxUid>2539356</IdxUid>
  <IdxSearchFields>
    <GRNT>AI 00468</GRNT>
    <GRNT>GM 07197</GRNT>
    <GRNT>GM 29067</GRNT>
  </IdxSearchFields>
</IdxDocument>
...
```

一旦完成了最终反演：

```
...
<InvDocument>
  <InvKey>ai 00468</InvKey>
  <InvIDs>
    <GRNT>2539356</GRNT>
  </InvIDs>
</InvDocument>
<InvDocument>
  <InvKey>gm 07197</InvKey>
  <InvIDs>
    <GRNT>2539356</GRNT>
  </InvIDs>
</InvDocument>
<InvDocument>
  <InvKey>gm 29067</InvKey>
  <InvIDs>
    <GRNT>2539356</InvIDs>
  </InvIDs>
</InvDocument>
...
```

和发布步骤完成后，新字段即可进行搜索。

### 按 XML 子集处理

查询在选定期刊中发表的摘要文章，从本地缓存中检索，并进行多步转换：

```bash
esearch -db pubmed -query "PNAS [JOUR]" -pub abstract |
efetch -format uid | fetch-pubmed |
xtract -stops -rec Rec -pattern PubmedArticle \
  -wrp Year -year "PubDate/*" -wrp Abst -words Abstract/AbstractText |
xtract -rec Pub -pattern Rec \
  -wrp Year -element Year -wrp Num -num Abst > countsByYear.xml
```

返回每条记录的出版年份和摘要中的单词数的结构化数据：

```
<Pub><Year>2018</Year><Num>198</Num></Pub>
<Pub><Year>2018</Year><Num>167</Num></Pub>
<Pub><Year>2018</Year><Num>242</Num></Pub>
```

（“**>**”重定向将结果保存到文件中。）

以下“for”循环使用 xtract ‑select 将处理的查询结果限制为每次一年，并将相关子集传递给第二个 xtract 命令：

```bash
for yr in {1960..2021}
do
  cat countsByYear.xml |
  xtract -set Raw -pattern Pub -select Year -eq "$yr" |
  xtract -pattern Raw -lbl "$yr" -avg Num
done |
```

应用‑avg 到单词计数，以计算当前年份每篇文章的平均摘要单词数：

```
1969    122
1970    120
1971    127
...
2018    207
2019    207
2020    208
```

可以通过重定向结果到文件保存结果，或者可以通过以下命令将其打印到终端并以图形格式显示结果：

```bash
tee /dev/tty |
xy-plot pnas.png
```

最后一步应为：

```bash
rm countsByYear.xml
```

以删除中间文件。

### 标识符转换

archive-pubmed 脚本还从 NLM FTP 服务器下载 MeSH 描述符信息并生成转换文件：

```
...
<Rec>
  <Code>D064007</Code>
  <Name>Ataxia Telangiectasia Mutated Proteins</Name>
  ...
  <Tree>D12.776.157.687.125</Tree>
  <Tree>D12.776.660.720.125</Tree>
</Rec>
...
```

该文件可用于将 MeSH 代码与化学或疾病名称相互映射。例如：

```bash
cat $EDIRECT_LOCAL_ARCHIVE/pubmed/Data/meshconv.xml |
xtract -pattern Rec \
  -if Name -starts-with "ataxia telangiectasia" \
    -element Code
```

将返回：

```
C565779
C576887
D001260
D064007
```

可以通过运行以下命令获取有关 MeSH 术语的更多信息：

```bash
efetch -db mesh -id D064007 -format docsum
```

### 与 Entrez 的集成

使用 phrase-search -filter 将搜索的 UID 结果（此处后跟链接步骤）与本地查询结合：

```bash
phrase-search -query "Berg CM [AUTH]" |
phrase-search -link CITED |
phrase-search -filter "Transposases [MESH]"
```

PMID 的中间列表可以保存到文件中，并在随后的 phrase-search ‑filter 查询中通过“cat”传递。它们还可以通过管道传递到 Entrez 历史服务器，通过以下命令：

```bash
epost -db pubmed
```

或直接通过管道传递给 **efetch**。

### 固态硬盘准备

要在 Mac 上初始化用于托管本地存档的固态硬盘，请登录到管理员账户，运行磁盘工具，选择查看 -> 显示所有设备，选择顶级外部驱动器，并按擦除图标。将方案弹出设置为 GUID 分区图，并选择 APFS 作为格式。将格式弹出设置为 APFS，输入卷的所需名称，然后点击擦除按钮。

要完成驱动器配置，请禁用驱动器上的 Spotlight 索引：

```bash
sudo mdutil -i off "${EDIRECT_LOCAL_ARCHIVE}"
sudo mdutil -E "${EDIRECT_LOCAL_ARCHIVE}"
```

并禁用 FSEvents 日志记录：

```bash
sudo touch "${EDIRECT_LOCAL_ARCHIVE}/.fseventsd/no_log"
```

还要将磁盘排除在 Time Machine 备份和病毒检查之外。

## 自动化

### Unix Shell 脚本

Shell 脚本可以用于对多个输入值重复相同的操作序列。Unix shell 是一个命令解释器，支持用户定义的变量、条件语句和重复执行循环。脚本通常保存在文件中，并通过文件名引用。

注释以井号（“**#**”）开头，会被忽略。引用字符串中的引号通过反斜杠（“**\**”）进行转义。子程序（函数）可以用来收集常见代码或简化脚本的组织。

### 合并相邻行的数据

给定一个特征键和值的制表符分隔文件，其中每个基因后面跟随其编码区域：

```
gene    matK
CDS     maturase K
gene    ATP2B1
CDS     ATPase 1 isoform 2
CDS     ATPase 1 isoform 7
gene    ps2
CDS     peptide synthetase
```

**cat** 命令可以将文件内容通过管道传递给一个 Shell 脚本，该脚本一次读取一行数据：

```bash
#!/bin/bash

gene=""
while IFS=$'\t' read feature product
do
  if [ "$feature" = "gene" ]
  then
    gene="$product"
  else
    echo "$gene\t$product"
  fi
done
```

结果输出行由 **echo** 命令打印，具有基因名称和后续 CDS 产品名称在单独行的单独列中：

```
matK      maturase K
ATP2B1    ATPase 1 isoform 2
ATP2B1    ATPase 1 isoform 7
ps2       peptide synthetase
```

解析脚本，第一行选择用户机器上的 Bash shell：

```bash
#!/bin/bash
```

最新的基因名称存储在"gene"变量中，首先将其初始化为空字符串：

```bash
gene=""
```

**while** 命令按顺序读取输入文件的每一行，**IFS** 表示制表符分隔字段，**read** 将第一个字段保存到"feature"变量中，将剩余文本保存到"product"变量中：

```bash
while IFS=$'\t' read feature product
```

**do** 和 **done** 命令之间的语句对每个输入行执行一次。**if** 语句检索存储在 feature 变量中的当前值（通过在变量名前加上美元符号（**$**）表示），并将其与单词"gene"进行比较：

```bash
if [ "$feature" = "gene" ]
```

如果特征键是"gene"，则运行 **then** 部分，将当前行的"product"值内容复制到持久的"gene"变量中：

```bash
then
  gene="$product"
```

否则 **else** 部分打印保存的基因名称和当前的编码区域产品名称：

```bash
else
  echo "$gene\t$product"
```

以制表符分隔。条件块以 **fi** 指令（"if"的反向）结束：

```bash
fi
```

除了 else，**elif** 命令可以允许一系列互斥的条件测试：

```bash
if [ "$feature" = "gene" ]
then
  ...
elif [ "$feature" = "mRNA" ]
then
  ...
elif [ "$feature" = "CDS" ]
then
  ...
else
  ...
fi
```

可以将变量设置为括在“**$(**”和“**)**”符号之间的命令结果：

```bash
mrna=$( echo "$product" | grep 'transcript variant' |
        sed 's/^.*transcript \(variant .*\).*$/\1/' )
```

### 脚本中的 Entrez Direct 命令

EDirect 命令也可以在脚本内运行。保存以下文本：

```bash
#!/bin/bash

printf "Years"
for disease in "$@"
do
  frst=$( echo -e "${disease:0:1}" | tr [a-z] [A-Z] )
  printf "\t${frst}${disease:1:3}"
done
printf "\n"

for (( yr = 2020; yr >= 1900; yr -= 10 ))
do
  printf "${yr}s"
  for disease in "$@"
  do
    val=$(
      esearch -db pubmed -query "$disease [TITL]" |
      efilter -mindate "${yr}" -maxdate "$((yr+9))" |
      xtract -pattern ENTREZ_DIRECT -element Count
    )
    printf "\t${val}"
  done
  printf "\n"
done
```

保存为名为"scan_for_diseases.sh"的文件并执行：

```bash
chmod +x scan_for_diseases.sh
```

允许通过名称调用脚本。传递多个疾病名称作为命令行参数：

```bash
scan_for_diseases.sh diphtheria pertussis tetanus |
```

返回一个多世纪以来每个疾病的论文计数，按十年分段：

```
Years    Diph    Pert    Teta
2020s    104     281     154
2010s    860     2558    1296
2000s    892     1968    1345
1990s    1150    2662    1617
1980s    780     1747    1488
...
```

通过管道将表格传递给：

```bash
xy-plot diseases.png
```

生成每个疾病每十年的论文数量的图表。

将数据传递给：

```bash
align-columns -h 2 -g 4 -a ln
```

右对齐数字数据列，以便于阅读或出版：

```
Years    Diph    Pert    Teta
2020s     104     281     154
2010s     860    2558    1296
2000s     892    1968    1345
1990s    1150    2662    1617
1980s     780    1747    1488
...
```

而将其通过管道传递给：

```bash
transmute -t2x -set Set -rec Rec -header
```

生成自定义 XML 结构，以便 xtract 进行进一步的比较分析。

### 时间延迟

Shell 脚本命令：

```bash
sleep 1
```

在步骤之间添加一秒钟的延迟，可用于帮助防止高级脚本过度使用服务器。

### Xargs/Sh 循环

通过巧妙使用 Unix xargs 和 sh 命令，有时可以避免编写循环数据的脚本。在"sh ‑c"命令字符串中，最后的名称和首字母参数（由"xargs ‑n 2"传递）替换为"$0"和"$1"变量。sh 字符串中的所有命令分别在每个名称上运行：

```bash
echo "Garber ED Casadaban MJ Mortimer RK" |
xargs -n 2 sh -c 'esearch -db pubmed -query "$0 $1 [AUTH]" |
xtract -pattern ENTREZ_DIRECT -lbl "$1 $0" -element Count'
```

这会生成每个作者的 PubMed 文章计数：

```
ED Garber       35
MJ Casadaban    46
RK Mortimer     85
```

### While 循环

"while" 循环也可以独立处理数据行。给定一个包含属-种名的文件 "organisms.txt"，使用 Unix 的 "cat" 命令：

```bash
cat organisms.txt |
```

写入文件内容：

```
Arabidopsis thaliana
Caenorhabditis elegans
Danio rerio
Drosophila melanogaster
Escherichia coli
Homo sapiens
Mus musculus
Saccharomyces cerevisiae
```

可以将其通过管道传递给一个每次读取一行的循环：

```bash
while read org
do
  esearch -db taxonomy -query "$org [LNGE] AND family [RANK]" < /dev/null |
  efetch -format docsum |
  xtract -pattern DocumentSummary -lbl "$org" \
    -element ScientificName Division
done
```

查找每个生物体的分类学科名称和 BLAST 分部：

```
Arabidopsis thaliana        Brassicaceae          eudicots
Caenorhabditis elegans      Rhabditidae           nematodes
Danio rerio                 Cyprinidae            bony fishes
Drosophila melanogaster     Drosophilidae         flies
Escherichia coli            Enterobacteriaceae    enterobacteria
Homo sapiens                Hominidae             primates
Mus musculus                Muridae               rodents
Saccharomyces cerevisiae    Saccharomycetaceae    ascomycetes
```

（"**< /dev/null**" 输入重定向结构防止 esearch 从 stdin 中“耗尽”剩余行。）

### For 循环

使用嵌入 "for" 循环的生物体名称可以获得相同的结果：

```bash
for org in \
  "Arabidopsis thaliana" \
  "Caenorhabditis elegans" \
  "Danio rerio" \
  "Drosophila melanogaster" \
  "Escherichia coli" \
  "Homo sapiens" \
  "Mus musculus" \
  "Saccharomyces cerevisiae"
do
  esearch -db taxonomy -query "$org [LNGE] AND family [RANK]" |
  efetch -format docsum |
  xtract -pattern DocumentSummary -lbl "$org" \
    -element ScientificName Division
done
```

### 文件探索

for 循环也可以用于探索计算机的文件系统：

```bash
for i in *
do
  if [ -f "$i" ]
  then
    echo $(basename "$i")
  fi
done
```

访问当前目录中的每个文件。星号（"\*"）字符表示所有文件，可以用任何模式（例如"\*.txt"）替换以限制文件搜索。if 语句中的"‑f"操作符可以更改为"‑d"以查找目录而不是文件，"‑s"选择大小大于零的文件。

### 分组处理

EDirect 提供了一个 **join-into-groups-of** 脚本，将唯一标识符或序列登录号的行组合成逗号分隔的组：

```bash
#!/bin/sh
xargs -n "$@" echo |
sed 's/ /,/g'
```

以下示例演示按每次 200 个登录号的分组处理序列记录：

```bash
...
efetch -format acc |
join-into-groups-of 200 |
xargs -n 1 sh -c 'epost -db nuccore -format acc -id "$0" |
elink -target pubmed |
efetch -format abstract'
```

### Go 语言编程

用编译语言编写的程序被翻译成计算机的本地机器指令代码，并且运行速度比解释脚本快得多，但代价是开发过程中的复杂性增加。

谷歌的 Go 语言（也称为"golang"）是“一种开源编程语言，使构建简单、可靠和高效的软件变得容易”。Go 消除了维护复杂"make"文件的需要。构建系统完全负责下载外部库包。自动依赖管理跟踪模块版本号以防止版本偏差。

截至 2020 年，Go 开发过程已经简化到比一些流行的脚本语言更容易使用的程度。

要构建 Go 程序，必须在计算机上安装最新的 Go 编译器。安装 URL 链接在本文档末尾的文档部分中。

### basecount.go 程序

将 FASTA 数据通过管道传递给 basecount 二进制可执行文件（从下面显示的 basecount.go 源代码文件编译而来）：

```bash
efetch -db nuccore -id J01749,U54469 -format fasta | basecount
```

将返回包含一个登录号后跟每个碱基计数的行：

```
J01749.1    A 983    C 1210    G 1134    T 1034
U54469.1    A 849    C 699     G 585     T 748
```

basecount.go 的完整（未注释）源代码如下所示，并在下文中讨论：

```go
package main

import (
    "eutils"
    "fmt"
    "os"
    "sort"
)

func main() {

    fsta := eutils.FASTAConverter(os.Stdin, false)

    countLetters := func(id, seq string) {

        counts := make(map[rune]int)
        for _, base := range seq {
            counts[base]++
        }

        var keys []rune
        for ky := range counts {
            keys = append(keys, ky)
        }
        sort.Slice(keys, func(i, j int) bool { return keys[i] < keys[j] })

        fmt.Fprintf(os.Stdout, "%s", id)
        for _, base := range keys {
            num := counts[base]
            fmt.Fprintf(os.Stdout, "\t%c %d", base, num)
        }
        fmt.Fprintf(os.Stdout, "\n")
    }

    for fsa := range fsta {
        countLetters(fsa.SeqID, fsa.Sequence)
    }
}
```

可以使用 Unix 的"time"命令来测量性能：

```bash
time basecount < NC_000014.fsa
```

该程序在 2.5 秒内读取并统计了现有 FASTA 文件中人类 14 号染色体的 107,043,718 个碱基：

```bash
NC_000014.9    A 26673415    C 18423758    G 18559033    N 16475569    T 26911943
2.287
```

### basecount.go 代码审查

Go 程序以 **package main** 开始，然后 **import** 额外的软件库（许多包含在 Go 中，其他位于如 github.com 的商业存储库中）：

```go
package main

import (
    "eutils"
    "fmt"
    "os"
    "sort"
)
```

每个编译的 Go 二进制文件有一个 **main** 函数，这是程序执行开始的地方：

```go
func main() {
```

fsta **变量** 分配给一个数据 **通道**，该通道一次流式传输单个 FASTA 记录：

```go
    fsta := eutils.FASTAConverter(os.Stdin, false)
```

countLetters **子程序** 将使用每个 FASTA 记录的标识符和序列调用：

```go
    countLetters := func(id, seq string) {
```

为每个序列创建一个空的 counts **映射**，并在子程序退出时释放其内存：

```go
        counts := make(map[rune]int)
```

**for** 循环在序列字符串的 **范围** 上访问每个序列字母。映射对每个碱基或残基进行计数，使用“**++**”递增字母映射条目的当前值：

```go
        for _, base := range seq {
           counts[base]++
        }
```

（按范围迭代字符串返回位置和字母对。由于代码未使用位置，其值由下划线（“**_**”）字符吸收。）

映射不会按定义顺序返回，因此映射键加载到一个键 **数组**，然后对其进行排序：

```go
        var keys []rune
        for ky := range counts {
            keys = append(keys, ky)
        }
        sort.Slice(keys, func(i, j int) bool { return keys[i] < keys[j] })
```

（传递给 sort.Slice 的第二个参数是一个 **匿名** 函数字面量，用于控制排序顺序。它也是一个 **闭包**，隐式继承了封闭函数的 keys 数组。）

在第一列中打印序列标识符：

```go
       fmt.Fprintf(os.Stdout, "%s", id)
```

迭代数组按字母顺序打印字母和碱基计数，列之间使用制表符分隔：

```go
        for _, base := range keys {
            num := counts[base]
            fmt.Fprintf(os.Stdout, "\t%c %d", base, num)
        }
```

在行末打印一个换行符，然后子程序退出，清除映射和数组：

```go
        fmt.Fprintf(os.Stdout, "\n")
    }
```

main 函数的其余部分使用循环 **排空** fsta 通道，将每个连续 FASTA 记录的标识符和序列字符串传递给 countLetters 函数。main 函数然后以一个最终的右括号结束：

```go
    for fsa := range fsta {
        countLetters(fsa.SeqID, fsa.Sequence)
    }
}
```

请注意，上述处理的人类 14 号染色体序列作为单个连续的 Go 字符串存储在其整个长度中。即使它超过 1.07 亿个字符，输入、访问或内存管理也不需要特殊的编码考虑。

### Go 依赖管理

EDirect 包括 **eutils** 辅助库的源代码，该库整合了 xtract、transmute 和 rchive 使用的常见函数，包括上面 basecount 程序使用的 FASTA 解析器/流媒体。

除了大约二十几个 eutils "*.go"文件外，分发还包含用于 eutils 包的"go.mod"和"go.sum"模块文件。它们是在发布到 FTP 站点之前在 eutils 目录中运行"./build.sh"创建的。

模块提供了一种自动管理外部依赖关系的机制。它们记录了开发过程中由 eutils 源文件导入的包的版本号和校验和。如果以后将 eutils 库合并到其他软件开发项目中，Go 将检索这些包的相同版本以及它们所有的内部支持包。

使用模块允许外部 Go 包独立发展，按自己的时间表发布具有不兼容函数参数签名的新版本，同时确保这种自然的软件开发周期不会在将来的某个不合时宜的时间打破工作库或应用程序构建。

### 编译一个 Go 项目

每个项目通常位于其自己的目录中。源代码可以拆分为多个文件，构建过程通常将所有的"*.go"文件一起编译。

创建一个名为"basecount"的新目录：

```bash
cd ~
mkdir basecount
```

并将 **basecount.go** 源代码文件复制到该目录中。

然后通过运行以下命令编译程序：

```bash
cd basecount
go mod init basecount
echo "replace eutils => $HOME/edirect/eutils" >> go.mod
go get eutils
go mod tidy
go build
```

但为了方便起见，这些命令通常被合并到一个构建脚本中。为此，将以下脚本保存到与 basecount.go 相同目录中的一个名为 **build.sh** 的文件中：

```bash
#!/bin/bash

if [ ! -f "go.mod" ]
then
  go mod init "$( basename $PWD )"
  echo "replace eutils => $HOME/edirect/eutils" >> go.mod
  go get eutils
fi

if [ ! -f "go.sum" ]
then
  go mod tidy
fi

go build
```

要编译可执行文件，进入 basecount 目录，设置 Unix 执行权限位，并运行构建脚本：

```bash
cd basecount
chmod +x build.sh
./build.sh
```

构建脚本运行 "**go mod init**" 生成 "go.mod"，如果任何模块文件尚不存在，则运行 "**go mod tidy**" 生成 "go.sum"。

（"$( basename $PWD )" 结构将可执行文件的默认名称设置为与父目录匹配，无需为每个项目手动自定义 "go mod init" 行。）

（"replace eutils => $HOME/edirect/eutils" 结构计算在标准 EDirect 安装位置中查找本地 eutils 源代码目录的路径。）

"**go build**" 指令编译应用程序和所有依赖库的源文件（缓存编译的目标文件以供以后更快使用）。然后它将这些文件链接到一个可以在开发机器上运行的二进制可执行文件中。

您可以选择特定的输入文件，更改可执行程序的名称，并使用 "go build" 的其他参数进行不同平台的交叉编译：

```bash
env GOOS=darwin GOARCH=arm64 go build -o basecount.Silicon basecount.go
```

可以通过将 "go build" 行更改为以下内容，在单个目录中构建多个项目：

```bash
for fl in *.go
do
  go build -o "${fl%.go}" "$fl"
done
```

### Python 集成

在 Python 脚本中控制 EDirect 非常简单，借助包含在 EDirect 归档中的 **edirect.py** 库文件：

```python
import subprocess
import shlex

def execute(cmmd, data=""):
    if isinstance(cmmd, str):
        cmmd = shlex.split(cmmd)
    res = subprocess.run(cmmd, input=data,
                         capture_output=True,
                         encoding='UTF-8')
    return res.stdout.strip()

def pipeline(cmmds, data=""):
    def flatten(cmmd):
        if isinstance(cmmd, str):
            return cmmd
        else:
            return shlex.join(cmmd)
    if not isinstance(cmmds, str):
        cmmds = ' | '.join(map(flatten, cmmds))
    res = subprocess.run(cmmds, input=data, shell=True,
                         capture_output=True,
                         encoding='UTF-8')
    return res.stdout.strip()

def efetch(*, db, id, format, mode=""):
    cmmd = ('efetch', '-db', db, '-id', str(id), '-format', format)
    if mode:
        cmmd = cmmd + ('-mode', mode)
    return execute(cmmd)
```

在程序的开头，用以下命令导入 edirect 模块：

```python
#!/usr/bin/env python3

import sys
import os
import shutil

sys.path.insert(1, os.path.dirname(shutil.which('xtract')))
import edirect
```

（请注意，导入命令使用 "edirect"，不带 ".py" 扩展名。）

**edirect.execute** 的第一个参数是您希望运行的 Unix 命令。它可以作为字符串提供：

```python
edirect.execute("efetch -db nuccore -id NM_000518.5 -format fasta")
```

或者作为字符串序列，这允许用变量的值替换特定参数：

```python
accession = "NM_000518.5"
edirect.execute(('efetch', '-db', 'nuccore', '-id', accession, '-format', 'fasta'))
```

可选的第二个参数接受要通过 stdin 传递给 Unix 命令的数据。通过在下一个命令中使用前一个命令的结果作为数据参数，可以将多个步骤链接在一起：

```python
seq = edirect.execute("efetch -db nuccore -id NM_000518.5 -format fasta")
sub = edirect.execute("transmute -extract -1-based -loc 51..494", seq)
prt = edirect.execute(('transmute', '-cds2prot', '-every', '-trim'), sub)
```

传递给脚本本身的数据通过使用 "**sys.stdin.read()**" 作为第二个参数来中继。

或者，**edirect.pipeline** 函数可以接受一个单独命令字符串的序列，以便一起通过管道执行：

```python
edirect.pipeline(('efetch -db protein -id NP_000509.1 -format gp',
                  'xtract -insd Protein mol_wt sub_sequence'))
```

或者执行包含多个管道命令的字符串：

```python
edirect.pipeline('''efetch -db nuccore -id J01749 -format fasta |
  transmute -replace -offset 1907 -delete GG -insert TC |
  transmute -search -circular GGATCC:BamHI GAATTC:EcoRI CTGCAG:PstI |
  align-columns -g 4 -a rl''')
```

隐藏细节（例如，isinstance，shlex.join，shlex.split 和 subprocess.run）在通用模块中意味着对编程不熟悉的生物学家可以从他们的第一个 Python 程序中控制整个分析管道。

一个使用命名参数的 **edirect.efetch** 快捷方式也可用：

```python
edirect.efetch(db="nuccore", id="NM_000518.5", format="fasta")
```

要运行自定义 shell 脚本，请确保设置了执行权限位，提供完整的执行路径，并在其后跟任何命令行参数：

```python
db = "pubmed"
res = edirect.execute(("./datefields.sh", db), "")
```

### 访问 NCBI C++工具包

可以使用 **ncbi::edirect::Execute** 函数从 NCBI C++工具包调用 EDirect 脚本：

```c++
#include <misc/eutils_client/eutils_client.hpp>
```

函数签名有单独的参数用于脚本名称及其命令行参数，后跟一个可选字符串，通过 stdin 传递：

```c++
string Execute (
  const string& cmmd,
  const vector<string>& args,
  const string& data = kEmptyStr
);
```

通过使用前一个结果作为下一个命令中的数据参数来链接多个步骤：

```c++
string seq = ncbi::edirect::Execute
  ( "efetch", { "-db", "nuccore", "-id", "NM_000518.5", "-format", "fasta" } );
string sub = ncbi::edirect::Execute
  ( "transmute", { "-extract", "-1-based", "-loc", "51..494" }, seq );
string prt = ncbi::edirect::Execute
  ( "transmute", { "-cds2prot", "-every", "-trim" }, sub );
```

参数向量也可以在程序控制下动态生成：

```c++
vector<string> args;

args.push_back("-db");
args.push_back("pubmed");
args.push_back("-format");
args.push_back("abstract");
args.push_back("-id");
args.push_back(uid);
```

可以在带有-asn 参数的 CPub 对象引用上执行引用匹配：

```c++
string uid = ncbi::edirect::Execute
  ( "cit2pmid", { "-asn", FORMAT(MSerial_FlatAsnText << pub) } );
```

或者可以使用-title、-author、-journal、-volume、-issue、-pages 和-year 参数。

如果找到匹配的 PMID，可以将其作为 PubmedArticle XML 检索并转换为 Pubmed-entry ASN.1：

```c++
string xml = ncbi::edirect::Execute
  ( "efetch", { "-db", "pubmed", "-format", "xml" }, uid );
string asn = ncbi::edirect::Execute
  ( "pma2pme", { "-std" }, xml );
```

然后可以使用对象加载器将 ASN.1 字符串读入内存以进行进一步处理：

```c++
#include <objects/pubmed/Pubmed_entry.hpp>

unique_ptr<CObjectIStream> stm;
stm.reset ( CObjectIStream::CreateFromBuffer
  ( eSerial_AsnText, asn.data(), asn.length() ) );

CRef<CPubmed_entry> pme ( new CPubmed_entry );
stm->Read ( ObjectInfo ( *pme ) );
```

## 其他示例

EDirect 示例演示如何在几个 Entrez 数据库中回答临时问题。详细示例已移至单独的文档，可以点击 [附加示例](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/example6/) 链接查看。

## 附录

### 命令行参数

每个 EDirect 程序都有一个 **-help** 命令，它打印有关可用参数的详细信息。这些参数包括 esearch 的 **-sort** 值、efetch 的 **-format** 和 **-mode** 选择，以及 elink 的 **-cmd** 选项。

### Einfo 数据

Einfo 字段数据包含多个术语列表索引属性的状态标志：

```
<Field>
  <Name>ALL</Name>
  <FullName>All Fields</FullName>
  <Description>All terms from all searchable fields</Description>
  <TermCount>280005319</TermCount>
  <IsDate>N</IsDate>
  <IsNumerical>N</IsNumerical>
  <SingleToken>N</SingleToken>
  <Hierarchy>N</Hierarchy>
  <IsHidden>N</IsHidden>
  <IsTruncatable>Y</IsTruncatable>
  <IsRangable>N</IsRangable>
</Field>
```

### Unix 实用程序

下面展示了几类有用的 Unix 文本处理过滤器，并选择了一些参数：

按内容处理：

```bash
sort    排序文本行

  -f    忽略大小写
  -n    数字比较
  -r    反向结果顺序

  -k    字段键（开始，结束或第一个）
  -u    具有相同键的唯一行

  -b    忽略前导空格
  -s    稳定排序
  -t    指定字段分隔符

uniq    删除重复行

  -c    计数出现次数
  -i    忽略大小写

  -f    忽略前 n 个字段
  -s    忽略前 n 个字符

  -d    只输出重复行
  -u    只输出非重复行

grep    使用正则表达式匹配模式

  -i    忽略大小写
  -v    反转搜索
  -w    将表达式作为单词搜索
  -x    将表达式作为整行搜索

  -e    指定单个模式

  -c    只计数匹配数
  -n    打印行号
  -A    匹配后面的行数
  -B    匹配前面的行数
```

正则表达式：

```bash
字符

  .     任意单个字符（换行符除外）
  \w    字母 [A-Za-z]、数字 [0-9] 或下划线 (_)
  \s    空白（空格或制表符）
  \     转义特殊字符
  []    匹配任何包含的字符

位置

  ^     行首
  $     行尾
  \b    单词边界

重复匹配

  ?     0 或 1 次
  *     0 次或多次
  +     1 次或多次
  {n}   恰好 n 次

转义序列

  \n    换行符
  \t    制表符
```

修改内容：

```bash
sed         替换文本字符串

  -e        指定单个表达式
  s///      替换
      /g    全局
      /I    不区分大小写
      /p    打印

tr          翻译字符

  -d        删除字符
  -s        压缩字符运行

rev         反转行上的字符
```

格式内容：

```bash
column  按内容宽度对齐列

  -s    指定字段分隔符
  -t    创建表格

expand  将列对齐到指定位置

  -t    制表符位置

fold    在特定宽度处换行

  -w    行宽
  -s    在空格处换行
```

按位置过滤：

```bash
cut     移除行的部分内容

  -c    要保留的字符
  -f    要保留的字段
  -d    指定字段分隔符

  -s    抑制没有分隔符的行

head    打印前几行

  -n    行数

tail    打印后几行

  -n    行数
```

杂项：

```bash
wc        计算字数、行数或字符数

  -c      字符数
  -l      行数
  -w      单词数

xargs     构造参数

  -n      每批单词数

mktemp    创建临时文件

join      按共同字段连接文件中的列

paste     按行号合并文件中的列
```

文件压缩：

```bash
tar     归档文件

  -c    创建归档
  -f    输出文件名
  -z    使用 gzip 压缩归档

gzip    压缩文件

  -k    保留原始文件
  -9    最佳压缩

unzip   解压 .zip 归档

  -p    输出到 stdout

gzcat   解压 .gz 归档并输出到 stdout
```

目录和文件导航：

```bash
cd      更改目录

  /     根目录
  ~     主目录
  .     当前目录
  ..    上级目录
  -     上一个目录

ls      列出文件名

  -1    每行一个条目
  -a    显示以点 (.) 开头的文件
  -l    以长格式列出
  -R    递归探索子目录
  -S    按大小排序文件
  -t    按最近修改排序
  .*    当前和上级目录

pwd     打印工作目录路径
```

文件重定向：

```bash
<         从文件读取 stdin
>         重定向 stdout 到文件
>>        追加到文件
2>        重定向 stderr
2>&1      将 stderr 合并到 stdout
|         程序间的管道
<(cmd)    执行命令，将结果作为文件读取
```

Shell 脚本变量：

```bash
$0      脚本名称
$n      第 n 个参数
$#      参数个数
"$*"    参数列表作为一个参数
"$@"    参数列表作为单独的参数
$?      上一个命令的退出状态
```

Shell 脚本测试：

```bash
-d      目录存在
-f      文件存在
-s      文件不为空
-n      字符串长度非零
-x      文件可执行
-z      变量为空或未设置
```

Shell 脚本选项：

```bash
set        设置可选行为

  -e       出错后立即退出
  -u       将未设置的变量视为错误
  -x       跟踪命令和参数
```

文件和目录提取：

```bash
        BAS=$(printf pubmed%03d $n) 
        DIR=$(dirname "$0")
        FIL=$(basename "$0")
```

移除前缀：

```bash
        FILE="example.tar.gz"
#       ${FILE#.*}  -> tar.gz
##      ${FILE##.*} -> gz
```

移除后缀：

```bash
        FILE="example.tar.gz"
        TYPE="http://identifiers.org/uniprot_enzymes/"
%       ${FILE%.*}  -> example.tar
        ${TYPE%/}   -> http://identifiers.org/uniprot_enzymes
%%      ${FILE%%.*} -> example
```

循环结构：

```bash
        while IFS=$'\t' read ...
        for sym in HBB BRCA2 CFTR RAG1
        for col in "$@"
        for yr in {1960..2020}
        for i in $(seq $first $incr $last)
        for fl in *.xml.gz
```

可以通过输入 "man" 后跟命令名称来获取带有详细说明和示例的附加文档。

## 发行说明

EDirect 发行说明描述了从最初的 Perl 实现到 Go 和 Shell 脚本重构的增量开发和重构历史。详细的说明已移至单独的文档，可以点击 [发行说明](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/release6/) 链接查看。

## 获取更多信息

### 公告邮件列表

NCBI 向 [utilities-announce 公告邮件列表](https://www.ncbi.nlm.nih.gov/mailman/listinfo/utilities-announce/) 发布有关 E-utilities 的常规公告。此邮件列表仅为公告列表；个人订阅者**不能**向列表发送邮件。此外，订阅者列表是私有的，仅用于向列表成员提供公告。该列表每月接收约一个帖子。请在上面的链接处订阅。

### 参考文献

史密森尼在线收藏数据库由国家自然历史博物馆提供，史密森尼学会，10th and Constitution Ave. N.W., Washington, DC 20560-0193. https://collections.nmnh.si.edu/.

den Dunnen JT, Dalgleish R, Maglott DR, Hart RK, Greenblatt MS, McGowan-Jordan J, Roux AF, Smith T, Antonarakis SE, Taschner PE. HGVS Recommendations for the Description of Sequence Variants: 2016 Update. Hum Mutat. 2016. https://doi.org/10.1002/humu.22981. (PMID 26931183.)

Holmes JB, Moyer E, Phan L, Maglott D, Kattman B. SPDI: data model for variants and applications at NCBI. Bioinformatics. 2020. https://doi.org/10.1093/bioinformatics/btz856. (PMID 31738401.)

Hutchins BI, Baker KL, Davis MT, Diwersy MA, Haque E, Harriman RM, Hoppe TA, Leicht SA, Meyer P, Santangelo GM. The NIH Open Citation Collection: A public access, broad coverage resource. PLoS Biol. 2019. https://doi.org/10.1371/journal.pbio.3000385. (PMID 31600197.)

Kim S, Thiessen PA, Cheng T, Yu B, Bolton EE. An update on PUG-REST: RESTful interface for programmatic access to PubChem. Nucleic Acids Res. 2018. https://doi.org/10.1093/nar/gky294. (PMID 29718389.)

Mitchell JA, Aronson AR, Mork JG, Folk LC, Humphrey SM, Ward JM. Gene indexing: characterization and analysis of NLM's GeneRIFs. AMIA Annu Symp Proc. 2003:460-4. (PMID 14728215.)

Ostell JM, Wheelan SJ, Kans JA. The NCBI data model. Methods Biochem Anal. 2001. https://doi.org/10.1002/0471223921.ch2. (PMID 11449725.)

Schuler GD, Epstein JA, Ohkawa H, Kans JA. Entrez: molecular biology database and retrieval system. Methods Enzymol. 1996. https://doi.org/10.1016/s0076-6879(96)66012-1. (PMID 8743683.)

Wei C-H, Allot A, Leaman R, Lu Z. PubTator central: automated concept annotation for biomedical full text articles. Nucleic Acids Res. 2019. https://doi.org/10.1093/nar/gkz389. (PMID 31114887.)

Wu C, Macleod I, Su AI. BioGPS and MyGene.info: organizing online, gene-centric information. Nucleic Acids Res. 2013. https://doi.org/10.1093/nar/gks1114. (PMID 23175613.)

### 文档

EDirect 导航功能调用基于 URL 的 Entrez 编程实用程序：

```
https://www.ncbi.nlm.nih.gov/books/NBK25501
```

NCBI 数据库资源由以下链接描述：

```
https://www.ncbi.nlm.nih.gov/pubmed/37994677
```

有关如何获取 API Key 的信息在此 NCBI 博客文章中描述：

```
https://ncbiinsights.ncbi.nlm.nih.gov/2017/11/02/new-api-keys-for-the-e-utilities
```

面向非程序员的 Shell 脚本介绍在：

```
https://missing.csail.mit.edu/2020/shell-tools/
```

由 Go 语言的创建者撰写的有关 Go 编程语言的文章在：

```
https://cacm.acm.org/research/the-go-programming-language-and-environment/
```

关于 Go 设计哲学和回顾经验的讲座记录在：

```
https://commandcenter.blogspot.com/2012/06/less-is-exponentially-more.html

https://commandcenter.blogspot.com/2024/01/what-we-got-right-what-we-got-wrong.html
```

下载和安装 Go 编译器的说明在：

```
https://golang.org/doc/install#download
```

附加 NCBI 网站和数据使用政策及免责声明信息在：

```
https://www.ncbi.nlm.nih.gov/home/about/policies/
```

### 公共领域声明

适用于 EDirect 的 NCBI 公共领域声明如下：

```
                 公共领域声明
             国家生物技术信息中心

根据美国版权法的条款，这个软件/数据库是“美国政府作品”。它是作为作者的官方职责的一部分编写的，因此不能被版权保护。这个软件/数据库可供公众免费使用。国家医学图书馆和美国政府对其使用或复制没有任何限制。

尽管已尽一切合理努力确保软件和数据的准确性和可靠性，但 NLM 和美国政府不对使用该软件或数据可能获得的性能或结果作出任何保证。NLM 和美国政府对性能、适销性或特定用途适用性的明示或暗示保证不承担任何责任。

在基于该材料的任何工作或产品中，请引用作者。
```

### 获取帮助

有关搜索查询、数据库索引、字段限制和数据库内容的更多信息，请参阅 [PubMed](https://www.ncbi.nlm.nih.gov/books/n/helppubmed/pubmedhelp/) 和 [Entrez](https://www.ncbi.nlm.nih.gov/books/n/helpentrez/EntrezHelp/) 帮助文档。

关于 EUtility 程序的建议、评论和问题可以发送到 [vog.hin.mln.ibcn@seitilitue](mailto:dev@null)。