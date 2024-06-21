---
order: 3
---
# E-utilities 示例应用程序

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
> 创建时间：2009 年 4 月 24 日；最后更新：2017 年 11 月 1 日。
>
> *预计阅读时间：9 分钟*

## 介绍

本章介绍了如何使用 E-utilities 构建有用的应用程序的几个示例。这些示例使用 Perl 创建 E-utility 管道，并假设已安装 LWP::Simple 模块。该模块包含支持 HTTP GET 请求的 *get* 函数。一个示例（应用程序 4）使用 HTTP POST 请求，需要 LWP::UserAgent 模块。在 Perl 中，标量变量名称前面有一个"$"符号，数组名称前面有一个"@"符号。在多个实例中，结果将存储在此类变量中，以供后续 E-utility 调用使用。这里的代码示例是可以复制到文本编辑器中并直接执行的工作程序。许多现代编程语言可以构造等效的 HTTP 请求；所需的只是创建和发送 HTTP 请求的能力。

## 基本管道

所有 E-utility 应用程序都由一系列调用组成，我们将其称为管道。最简单的 E-utility 管道由两个调用组成，任何任意的管道都可以从这些基本构建块中组装而成。这些管道中的许多最终调用 ESummary（检索 DocSums）或 EFetch（检索完整记录）。注释部分指出了每个调用所需的代码部分。

## ESearch – ESummary/EFetch

**输入：** Entrez 文本查询

**ESummary 输出：** XML 文档摘要

**EFetch 输出：** 格式化的数据记录（例如摘要、FASTA）

```perl
use LWP::Simple;

# 下载在 MeSH 中索引了哮喘和白三烯并且在 2009 年发布的 PubMed 记录。

$db = 'pubmed';
$query = 'asthma[mesh]+AND+leukotrienes[mesh]+AND+2009[pdat]';

# 组装 esearch URL
$base = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/';
$url = $base . "esearch.fcgi?db=$db&term=$query&usehistory=y";

# 发布 esearch URL
$output = get($url);

# 解析 WebEnv 和 QueryKey
$web = $1 if ($output =~ /<WebEnv>(\S+)<\/WebEnv>/);
$key = $1 if ($output =~ /<QueryKey>(\d+)<\/QueryKey>/);

### 包含此代码用于 ESearch-ESummary
# 组装 esummary URL
$url = $base . "esummary.fcgi?db=$db&query_key=$key&WebEnv=$web";

# 发布 esummary URL
$docsums = get($url);
print "$docsums";

### 包含此代码用于 ESearch-EFetch
# 组装 efetch URL
$url = $base . "efetch.fcgi?db=$db&query_key=$key&WebEnv=$web";
$url .= "&rettype=abstract&retmode=text";

# 发布 efetch URL
$data = get($url);
print "$data";
```

## EPost – ESummary/EFetch

**输入：** Entrez UID（整数标识符，如 PMID、GI、Gene ID）列表

**ESummary 输出：** XML 文档摘要

**EFetch 输出：** 格式化的数据记录（例如摘要、FASTA）

```perl
use LWP::Simple;

# 下载对应于 GI 号码列表的蛋白质记录。

$db = 'protein';
$id_list = '194680922,50978626,28558982,9507199,6678417';

# 组装 epost URL
$base = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/';
$url = $base . "epost.fcgi?db=$db&id=$id_list";

# 发布 epost URL
$output = get($url);

# 解析 WebEnv 和 QueryKey
$web = $1 if ($output =~ /<WebEnv>(\S+)<\/WebEnv>/);
$key = $1 if ($output =~ /<QueryKey>(\d+)<\/QueryKey>/);

### 包含此代码用于 EPost-ESummary
# 组装 esummary URL
$url = $base . "esummary.fcgi?db=$db&query_key=$key&WebEnv=$web";

# 发布 esummary URL
$docsums = get($url);
print "$docsums";

### 包含此代码用于 EPost-EFetch
# 组装 efetch URL
$url = $base . "efetch.fcgi?db=$db&query_key=$key&WebEnv=$web";
$url .= "&rettype=fasta&retmode=text";

# 发布 efetch URL
$data = get($url);
print "$data";
```

***注意：*** *要在单个 URL 中发布大量（超过几百个）UID，请使用 HTTP POST 方法进行 EPost 调用（参见* [应用程序 4](https://www.ncbi.nlm.nih.gov/books/NBK25498/#chapter3.Application_4_Finding_unique_se)*）。*

## ELink – ESummary/EFetch

**输入：** 数据库 A 中的 Entrez UID 列表（整数标识符，例如 PMID，GI，Gene ID）

**ESummary 输出：** 来自数据库 B 的链接 XML 文档摘要

**EFetch 输出：** 来自数据库 B 的格式化数据记录（例如摘要、FASTA）

```perl
use LWP::Simple;

# 下载与一组蛋白质对应的基因记录，这些蛋白质对应于 GI 号码列表。

$db1 = 'protein';  # &dbfrom
$db2 = 'gene';     # &db
$linkname = 'protein_gene'; # 所需链接 &linkname
# 数据库 A 中的输入 UID（蛋白质 GI 号）
$id_list = '194680922,50978626,28558982,9507199,6678417';

# 组装 elink URL
$base = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/';
$url = $base . "elink.fcgi?dbfrom=$db1&db=$db2&id=$id_list";
$url .= "&linkname=$linkname&cmd=neighbor_history";

# 发布 elink URL
$output = get($url);

# 解析 WebEnv 和 QueryKey
$web = $1 if ($output =~ /<WebEnv>(\S+)<\/WebEnv>/);
$key = $1 if ($output =~ /<QueryKey>(\d+)<\/QueryKey>/);

### 包含此代码用于 ELink-ESummary
# 组装 esummary URL
$url = $base . "esummary.fcgi?db=$db2&query_key=$key&WebEnv=$web";

# 发布 esummary URL
$docsums = get($url);
print "$docsums";

### 包含此代码用于 ELink-EFetch
# 组装 efetch URL
$url = $base . "efetch.fcgi?db=$db2&query_key=$key&WebEnv=$web";
$url .= "&rettype=xml&retmode=xml";

# 发布 efetch URL
$data = get($url);
print "$data";
```

***注意：*** *要在一个 URL 中提交大量（超过几百个）UID 到 ELink，请使用 HTTP POST 方法进行 ELink 调用（参见应用程序 4）。使用 &linkname 参数可以强制 ELink 只返回一组链接（一个 &query_key）以简化解析。如果需要多个链接，必须修改上述代码以从 ELink XML 输出中解析多个&query_key 值。此代码在“批量”模式下使用 ELink，只返回一组基因 ID，并丢失蛋白质 GI 与基因 ID 之间的一对一对应关系。要保持这种一对一对应关系，请参见 [应用程序 4](https://www.ncbi.nlm.nih.gov/books/NBK25498/#chapter3.Application_4_Finding_unique_se)。*

## ESearch – ELink – ESummary/EFetch

**输入：** 数据库 A 中的 Entrez 文本查询

**ESummary 输出：** 来自数据库 B 的链接 XML 文档摘要

**EFetch 输出：** 来自数据库 B 的格式化数据记录（例如摘要、FASTA）

```perl
use LWP::Simple;

# 下载与 2009 年发布的摘要相关的蛋白质 FASTA 记录，这些摘要在 MeSH 中索引了哮喘和白三烯。

$db1 = 'pubmed';
$db2 = 'protein';
$linkname = 'pubmed_protein';
$query = 'asthma[mesh]+AND+leukotrienes[mesh]+AND+2009[pdat]';

# 组装 esearch URL
$base = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/';
$url = $base . "esearch.fcgi?db=$db1&term=$query&usehistory=y";
# 发布 esearch URL
$output = get($url);

# 解析 WebEnv 和 QueryKey
$web1 = $1 if ($output =~ /<WebEnv>(\S+)<\/WebEnv>/);
$key1 = $1 if ($output =~ /<QueryKey>(\d+)<\/QueryKey>/);

# 组装 elink URL
$base = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/';
$url = $base . "elink.fcgi?dbfrom=$db1&db=$db2";
$url .= "&query_key=$key1&WebEnv=$web1";
$url .= "&linkname=$linkname&cmd=neighbor_history";
print "$url\n";

# 发布 elink URL
$output = get($url);
print "$output\n";

# 解析 WebEnv 和 QueryKey
$web2 = $1 if ($output =~ /<WebEnv>(\S+)<\/WebEnv>/);
$key2 = $1 if ($output =~ /<QueryKey>(\d+)<\/QueryKey>/);

### 包含此代码用于 ESearch-ELink-ESummary
# 组装 esummary URL
$url = $base . "esummary.fcgi?db=$db2&query_key=$key2&WebEnv=$web2";
# 发布 esummary URL
$docsums = get($url);
print "$docsums";

### 包含此代码用于 ESearch-ELink-EFetch
# 组装 efetch URL
$url = $base . "efetch.fcgi?db=$db2&query_key=$key2&WebEnv=$web2";
$url .= "&rettype=fasta&retmode=text";
# 发布 efetch URL
$data = get($url);
print "$data";
```

***注意：*** *使用&linkname 参数可以强制 ELink 只返回一组链接（一个 &query_key）以简化解析。如果需要多个链接，必须修改上述代码以从 ELink XML 输出中解析多个 &query_key 值。此代码在“批量”模式下使用 ELink，只返回一组 PubMed ID，并丢失 PubMed ID 及其相关 PubMed ID 之间的一对一对应关系。要保持这种一对一对应关系，请参见 [应用程序 4](https://www.ncbi.nlm.nih.gov/books/NBK25498/#chapter3.Application_4_Finding_unique_se) 。*

## EPost – ELink – ESummary/EFetch

**输入：** 数据库 A 中的 Entrez UID 列表（整数标识符，例如 PMID，GI，Gene ID）

**ESummary 输出：** 来自数据库 B 的链接 XML 文档摘要

**EFetch 输出：** 来自数据库 B 的格式化数据记录（例如摘要、FASTA）

```perl
use LWP::Simple;

# 下载与一组蛋白质对应的基因记录，这些蛋白质对应于蛋白质 GI 号列表。

$db1 = 'protein';  # &dbfrom
$db2 = 'gene';     # &db
$linkname = 'protein_gene';
# 数据库 A 中的输入 UID（蛋白质 GI 号）
$id_list = '194680922,50978626,28558982,9507199,6678417';

# 组装 epost URL
$base = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/';
$url = $base . "epost.fcgi?db=$db1&id=$id_list";

# 发布 epost URL
$output = get($url);

# 解析 WebEnv 和 QueryKey
$web1 = $1 if ($output =~ /<WebEnv>(\S+)<\/WebEnv>/);
$key1 = $1 if ($output =~ /<QueryKey>(\d+)<\/QueryKey>/);

# 组装 elink URL
$base = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/';
$url = $base . "elink.fcgi?dbfrom=$db1&db=$db2&query_key=$key1";
$url .= "&WebEnv=$web1&linkname=$linkname&cmd=neighbor_history";

# 发布 elink URL
$output = get($url);

# 解析 WebEnv 和 QueryKey
$web2 = $1 if ($output =~ /<WebEnv>(\S+)<\/WebEnv>/);
$key2 = $1 if ($output =~ /<QueryKey>(\d+)<\/QueryKey>/);

### 包含此代码用于 EPost-ELink-ESummary
# 组装 esummary URL
$url = $base . "esummary.fcgi?db=$db2&query_key=$key2&WebEnv=$web2";

# 发布 esummary URL
$docsums = get($url);
print "$docsums";

### 包含此代码用于 EPost-ELink-EFetch
# 组装 efetch URL
$url = $base . "efetch.fcgi?db=$db2&query_key=$key2&WebEnv=$web2";
$url .= "&rettype=xml&retmode=xml";

# 发布 efetch URL
$data = get($url);
print "$data";
```

***注意：*** *要在单个 URL 中发布大量（超过几百个）UID，请使用 HTTP POST 方法进行 EPost 调用（参见下文应用程序 4）。使用 &linkname 参数可以强制 ELink 只返回一组链接（一个 &query_key）以简化解析。如果需要多个链接，必须修改上述代码以从 ELink XML 输出中解析多个 &query_key 值。此代码在“批量”模式下使用 ELink，只返回一组基因 ID，并丢失蛋白质 GI 与基因 ID 之间的一对一对应关系。要保持这种一对一对应关系，请参见 [应用程序 4](https://www.ncbi.nlm.nih.gov/books/NBK25498/#chapter3.Application_4_Finding_unique_se)。*

## EPost – ESearch

**输入：** Entrez UID 列表（整数标识符，例如 PMID、GI、Gene ID）

**输出：** 包含与 Entrez 文本查询匹配的已发布 UID 子集的历史集

```perl
use LWP::Simple;

# 给定一组蛋白质 GI 号码，此脚本创建一个历史集，
# 该历史集包含输入集中对应于人类蛋白质的成员。
# （这些蛋白质中哪些来自人类？）

$db = 'protein';
$query = 'human[orgn]';
$id_list = '194680922,50978626,28558982,9507199,6678417';

# 组装 epost URL
$base = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/';
$url = $base . "epost.fcgi?db=$db&id=$id_list";

# 发布 epost URL
$output = get($url);

# 解析 WebEnv 和 QueryKey
$web = $1 if ($output =~ /<WebEnv>(\S+)<\/WebEnv>/);
$key = $1 if ($output =~ /<QueryKey>(\d+)<\/QueryKey>/);

# 组装 esearch URL
$term = "%23$key+AND+$query";  
# %23 在查询键前加上一个#
$url = $base . "esearch.fcgi?db=$db&term=$term";
$url .= "&WebEnv=$web&usehistory=y";

# 发布 esearch URL
$limited = get($url);

print "$limited\n";

# 输出保留在历史服务器上（&query_key，&WebEnv）
# 使用 ESummary 或 EFetch 检索它们
```

***注意：*** *要在单个 URL 中发布大量（超过几百个）UID，请使用 HTTP POST 方法进行 EPost 调用（参见 [应用程序 4](https://www.ncbi.nlm.nih.gov/books/NBK25498/#chapter3.Application_4_Finding_unique_se)）。*

## ELink – ESearch

**输入：** 数据库 A 中的 Entrez UID 列表（整数标识符，例如 PMID，GI，Gene ID）

**输出：** 包含数据库 B 中链接的 UID 子集的历史集，这些 UID 匹配 Entrez 文本查询

```perl
use LWP::Simple;

# 给定一组蛋白质 GI 号码，此脚本创建一个历史集，
# 该历史集包含链接到输入集成员的基因 ID，这些基因 ID 也位于人类 X 染色体上。
# （哪些输入蛋白质由人类 X 染色体上的基因编码？）

$db1 = 'protein';  # &dbfrom
$db2 = 'gene';     # &db
$linkname = 'protein_gene'; # 所需链接 &linkname
$query = 'human[orgn]+AND+x[chr]';
# 数据库 A 中的输入 UID（蛋白质 GI 号）
$id_list = '148596974,42544182,187937179,4557377,6678417';

# 组装 elink URL
$base = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/';
$url = $base . "elink.fcgi?dbfrom=$db1&db=$db2&id=$id_list";
$url .= "&linkname=$linkname&cmd=neighbor_history";

# 发布 elink URL
$output = get($url);

# 解析 WebEnv 和 QueryKey
$web = $1 if ($output =~ /<WebEnv>(\S+)<\/WebEnv>/);
$key = $1 if ($output =~ /<QueryKey>(\d+)<\/QueryKey>/);

# 组装 esearch URL
$term = "%23$key+AND+$query";  # %23 在查询键前加上#
$url = $base . "esearch.fcgi?db=$db2&term=$term&WebEnv=$web&usehistory=y";

# 发布 esearch URL
$limited = get($url);

print "$limited\n";

# 输出保留在历史服务器上（&query_key，&WebEnv）
# 使用之前示例中的 ESummary 或 EFetch 检索它们
```

***注意：*** *要在一个 URL 中提交大量（超过几百个）UID 到 ELink，请使用 HTTP POST 方法进行 ELink 调用（参见 [应用程序 4](https://www.ncbi.nlm.nih.gov/books/NBK25498/#chapter3.Application_4_Finding_unique_se)）。使用 &linkname 参数可以强制 ELink 只返回一组链接（一个 &query_key）以简化解析。如果需要多个链接，必须修改上述代码以从 ELink XML 输出中解析多个&query_key 值。此代码在“批量”模式下使用 ELink，只返回一组基因 ID，并丢失蛋白质 GI 与基因 ID 之间的一对一对应关系。要保持这种一对一对应关系，请参见 [应用程序 4](https://www.ncbi.nlm.nih.gov/books/NBK25498/#chapter3.Application_4_Finding_unique_se)。*

## 应用程序 1：将 GI 号转换为登录号

**目标：** 从一组核苷酸 GI 号开始，准备一组对应的登录号。

**解决方案：** 使用 EFetch 和 &rettype=acc

**输入：** $gi_list – 逗号分隔的 GI 号列表

**输出：** 登录号列表。

```perl
use LWP::Simple;
$gi_list = '24475906,224465210,50978625,9507198';

# 组装 URL
$base = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/';
$url = $base . "efetch.fcgi?db=nucleotide&id=$gi_list&rettype=acc";

# 发布 URL
$output = get($url);
print "$output";
```

***注意：*** *输出中的登录顺序将与$gi_list 中的 GI 号顺序相同。*

## 应用程序 2：将登录号转换为数据

**目标：** 从一组蛋白质登录号开始，返回 FASTA 格式的序列。

**解决方案：** 创建一个由'OR'分隔的字符串，其中每个项目是一个登录号，后跟'[accn]'。

示例：accn1[accn]+OR+accn2[accn]+OR+accn3[accn]+OR+…

将此字符串作为&term 提交给 ESearch，然后使用 EFetch 检索 FASTA 数据。

**输入：** $acc_list – 逗号分隔的登录号列表

**输出：** FASTA 数据

```perl
use LWP::Simple;
$acc_list = 'NM_009417,NM_000547,NM_001003009,NM_019353';
@acc_array = split(/,/, $acc_list);

# 为每个登录号追加 [accn] 字段
for ($i=0; $i < @acc_array; $i++) {
   $acc_array[$i] .= "[accn]";
}

# 使用 OR 连接登录号
$query = join('+OR+',@acc_array);

# 组装 esearch URL
$base = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/';
$url = $base . "esearch.fcgi?db=nuccore&term=$query&usehistory=y";

# 发布 esearch URL
$output = get($url);

# 解析 WebEnv 和 QueryKey
$web = $1 if ($output =~ /<WebEnv>(\S+)<\/WebEnv>/);
$key = $1 if ($output =~ /<QueryKey>(\d+)<\/QueryKey>/);

# 组装 efetch URL
$url = $base . "efetch.fcgi?db=nuccore&query_key=$key&WebEnv=$web";
$url .= "&rettype=fasta&retmode=text";

# 发布 efetch URL
$fasta = get($url);
print "$fasta";
```

***注意：*** *对于大量登录号，使用 HTTP POST 提交 esearch 请求（参见 [应用程序 4](https://www.ncbi.nlm.nih.gov/books/NBK25498/#chapter3.Application_4_Finding_unique_se)），并参见 [应用程序 3](https://www.ncbi.nlm.nih.gov/books/NBK25498/#chapter3.Application_3_Retrieving_large) 以批量下载大集合。*

## 应用程序 3：检索大型数据集

**目标：** 下载所有黑猩猩 mRNA 序列的 FASTA 格式数据（超过 50,000 个序列）。

**解决方案：** 首先使用 ESearch 检索这些序列的 GI 号并将它们发布到历史服务器上，然后使用多个 EFetch 调用以每批 500 个的方式检索数据。

**输入：** $query – chimpanzee[orgn]+AND+biomol+mrna[prop]

**输出：** 一个名为“chimp.fna”的文件，包含 FASTA 数据。

```perl
use LWP::Simple;
$query = 'chimpanzee[orgn]+AND+biomol+mrna[prop]';

# 组装 esearch URL
$base = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/';
$url = $base . "esearch.fcgi?db=nucleotide&term=$query&usehistory=y";

# 发布 esearch URL
$output = get($url);

# 解析 WebEnv、QueryKey 和 Count（检索的记录数）
$web = $1 if ($output =~ /<WebEnv>(\S+)<\/WebEnv>/);
$key = $1 if ($output =~ /<QueryKey>(\d+)<\/QueryKey>/);
$count = $1 if ($output =~ /<Count>(\d+)<\/Count>/);

# 打开输出文件进行写入
open(OUT, ">chimp.fna") || die "无法打开文件！\n";

# 以每批 500 个的方式检索数据
$retmax = 500;
for ($retstart = 0; $retstart < $count; $retstart += $retmax) {
        $efetch_url = $base ."efetch.fcgi?db=nucleotide&WebEnv=$web";
        $efetch_url .= "&query_key=$key&retstart=$retstart";
        $efetch_url .= "&retmax=$retmax&rettype=fasta&retmode=text";
        $efetch_out = get($efetch_url);
        print OUT "$efetch_out";
}
close OUT;
```

## 应用程序 4：为大型数据集的每个成员找到唯一的链接记录集

**目标：** 分别下载当前人类 20 号染色体上的每个基因的 SNP rs 号（标识符）。

**解决方案：** 首先使用 ESearch 检索基因的 Gene ID，然后组装一个 ELink URL，其中每个 Gene ID 作为单独的&id 参数提交。

**输入：** $query – human[orgn]+AND+20[chr]+AND+alive[prop]

**输出：** 一个名为“snp_table”的文件，每行包含基因 ID，后跟一个冒号（“:”），然后是逗号分隔的链接 SNP rs 号列表。

```perl
use LWP::Simple;
use LWP::UserAgent;
$query = 'human[orgn]+AND+20[chr]+AND+alive[prop]';
$db1 = 'gene';
$db2 = 'snp';
$linkname = 'gene_snp';

# 组装 esearch URL
$base = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/';
$url = $base . "esearch.fcgi?db=$db1&term=$query&usehistory=y&retmax=5000";

# 发布 esearch URL
$output = get($url);

# 解析检索到的 ID
while ($output =~ /<Id>(\d+?)<\/Id>/sg) {
   push(@ids, $1);
}

# 将 elink URL 组装为 HTTP POST 调用
$url = $base . "elink.fcgi";

$url_params = "dbfrom=$db1&db=$db2&linkname=$linkname";
foreach $id (@ids) {    
   $url_params .= "&id=$id";
}

# 创建 HTTP 用户代理
$ua = new LWP::UserAgent;
$ua->agent("elink/1.0 " . $ua->agent);

# 创建 HTTP 请求对象
$req = new HTTP::Request POST => "$url";
$req->content_type('application/x-www-form-urlencoded');
$req->content("$url_params");

# 发布 HTTP 请求
$response = $ua->request($req); 
$output = $response->content;

open (OUT, ">snp_table") || die "无法打开文件！\n";

while ($output =~ /<LinkSet>(.*?)<\/LinkSet>/sg) {

   $linkset = $1;
   if ($linkset =~ /<IdList>(.*?)<\/IdList>/sg) {
      $input = $1;
      $input_id = $1 if ($input =~ /<Id>(\d+)<\/Id>/sg); 
   }

   while ($linkset =~ /<Link>(.*?)<\/Link>/sg) {
      $link = $1;
      push (@output, $1) if ($link =~ /<Id>(\d+)<\/Id>/);
   }
    
   print OUT "$input_id:" . join(',', @output) . "\n";
  
}

close OUT;
```

***注意：*** *此示例使用 HTTP POST 请求进行 elink 调用，因为 Gene ID 的数量超过 500。ESearch 调用中的 &retmax 参数设置为 5000，因为这是一次请求中发送到 ELink 的 ID 数量的合理限制（如果发送 5000 个 ID，实际上是在执行 5000 次 ELink 操作）。如果需要链接超过 5000 条记录，请在 ESearch 调用中添加 &retstart，并为每批 5000 个 ID 重复整个过程，每批递增 &retstart。*

## 演示程序

请参阅 [第 1 章](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter1/#chapter1.Demonstration_Programs) 中的 Perl 脚本示例。

## 更多信息

请参阅 [第 1 章](https://www.ncbi.nlm.nih.gov/books/n/helpeutils/chapter1/#chapter1.For_More_Information_8) 以获取有关 E-utilities 的更多信息。
