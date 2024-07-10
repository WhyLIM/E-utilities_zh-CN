---
order: 7
---

# Entrez Direct 示例

> Jonathan Kans, PhD.
>
> [作者信息和隶属关系](https://www.ncbi.nlm.nih.gov/books/NBK565821/#__NBK565821_ai__)
>
> 创建时间：2013 年 4 月 23 日；最后更新：2024 年 4 月 12 日。
>
> *预计阅读时间：21 分钟*

一些早期的 EDirect 示例需要使用 shell 脚本进行后处理：

```
  start=$(( start + 1 ))
  stop=$(( stop + 1 ))
```

或 awk 命令：

```
  awk -F '\t' -v 'OFS=\t' '{print $1, $2+1, $3+1}'
```

以增加基于 0 的序列坐标，以便检索正确的区域：

```
  efetch -db nuccore -id $accn -format fasta -seq_start $start -seq_stop $stop
```

这导致了-element 衍生工具，可以在 xtract 命令中进行简单的调整：

```
  -element ChrAccVer -inc ChrStart -1-based ChrStop
```

以及可以直接采用基于 0 的坐标的 efetch 参数：

```
  efetch -db nuccore -id $accn -format fasta -chr_start $start -chr_stop $stop
```

这些帮助消除了脚本对提取数据进行简单修改的需要。

最近的工作允许使用 filter-columns 更轻松地进行事后数值处理：

```
  filter-columns '10 <= $2 && $2 <= 30'
```

以及 print-columns：

```
  print-columns '$1, $2+1, $3-1, "\042" $4 "\042", tolower($5), log($3), total += $2'
```

这些脚本接受参数中的列设计器并将其传递给内部的 awk 命令。还可以使用内置变量 NF（字段数）和 NR（当前记录号），以及 YR（年份）和 DT（YYYY-MM-DD 格式的日期）。

## PubMed

### 作者频率

谁是关于响尾蛇磷脂酶的高产作者？

```
  esearch -db pubmed -query \
    "crotalid venoms [MAJR] AND phospholipase [TIAB]" |
  efetch -format xml |
  xtract -pattern PubmedArticle \
    -block Author -sep " " -tab "\n" -element LastName,Initials |
  sort-uniq-count-rank
```

将作者名字放在单独的行上允许 sort-uniq-count-rank 生成频率表：

```
  87    Lomonte B
  77    Gutiérrez JM
  64    Soares AM
  53    Marangoni S
  43    Giglio JR
  39    Bon C
  ...
```

### 发表分布

关于军团病的文章最多的年份是什么时候？

```
  esearch -db pubmed -query "legionnaires disease [TITL]" |
  efetch -format docsum |
  xtract -pattern DocumentSummary -element PubDate |
  cut -c 1-4 |
  sort-uniq-count-rank
```

在这种情况下，sort-uniq-count-rank 报告每年选择的文章数量：

```
  173    1979
  102    1980
  96     1978
  92     1981
  66     1983
  ...
```

在 PubmedArticle 记录上使用‑year "PubDate/*"会取遇到的第一个四位数，结果不需要修剪：

```
  esearch -db pubmed -query "legionnaires disease [TITL]" |
  efetch -format xml |
  xtract -pattern PubmedArticle -year "PubDate/*" |
  sort-uniq-count-rank
```

### 治疗地点

脓毒症治疗研究的地理分布是什么？

```
  esearch -db pubmed -query \
    "sepsis/therapy [MESH] AND geographic locations [MESH]" |
  efetch -format xml |
  xtract -pattern PubmedArticle \
    -block MeshHeading -if DescriptorName@Type -equals Geographic \
      -tab "\n" -element DescriptorName |
  sort-uniq-count-rank
```

这将按国家或地区返回文章数量排名：

```
  660    United States
  250    Spain
  182    Germany
  168    India
  155    Taiwan
  139    Japan
  126    China
  124    France
  123    Europe
  ...
```

请注意，England 和 United Kingdom 将作为两个单独的条目出现。

### 索引日期字段

PubMed 索引了哪些日期字段？

```
  einfo -db pubmed |
  xtract -pattern Field \
    -if IsDate -equals Y -and IsHidden -equals N \
      -pfx "[" -sfx "]" -element Name \
      -pfx "" -sfx "" -element FullName |
  sort -k 2f | expand
```

索引日期显示为字段缩写和描述性名称：

```
  [CDAT]  Date - Completion
  [CRDT]  Date - Create
  [EDAT]  Date - Entrez
  [MHDA]  Date - MeSH
  [MDAT]  Date - Modification
  [PDAT]  Date - Publication
```

### 数字对象标识符

如何从 PubMed 文章中获取数字对象标识符？

```
  esearch -db pubmed -query "Rowley JD [AUTH]" |
  efetch -format xml |
  xtract -head '<html><body>' -tail '</body></html>' \
    -pattern PubmedArticle -PMID MedlineCitation/PMID \
      -block ArticleId -if @IdType -equals doi \
        -tab "" -pfx '<p><a href="' -sfx '">' -doi ArticleId \
        -tab "\n" -pfx '' -sfx '</a></p>' -element "&PMID" |
  transmute -format
```

`-doi` 命令提取 DOI 并构建 URL 引用。这里使用的 `-pfx` 和 `-sfx` 参数将每个 PMID 封装在可点击的 DOI 链接中：

```
  <?xml version="1.0" encoding="UTF-8" ?>
  <!DOCTYPE html>
  <html>
    <body>
      <p>
        <a href="https://doi.org/10.1038%2Fleu.2013.340">24496283</a>
      </p>
      <p>
        <a href="https://doi.org/10.1073%2Fpnas.1310656110">23818607</a>
      </p>
      ...
    </body>
  </html>
```

### 参考文献格式化

主 EDirect 文档页面上的参考文献是如何格式化的？

```
  efetch -db pubmed -format docsum -id 26931183 31738401 31600197 \
    29718389 14728215 11449725 8743683 31114887 23175613 |
```

相关文档摘要字段收集如下：

```
  xtract -set Set -rec Rec -pattern DocumentSummary \
    -sep ", " -sfx "." -NM Name -clr \
    -sfx "." -SRC Source -clr \
    -pfx ":" -PG Pages -clr \
    -pfx "(PMID " -sfx ".)" -ID Id -clr \
    -group ArticleId -if IdType -equals doi \
      -pfx "https://doi.org/" -sfx "." -DOI Value -PG "(.)" -clr \
    -group DocumentSummary \
      -wrp Sort -lower "&NM" \
      -wrp Name -element "&NM" \
      -wrp Title -element Title \
      -wrp Source -element "&SRC" \
      -wrp Year -year PubDate \
      -wrp Pages -element "&PG" \
      -wrp DOI -element "&DOI" \
      -wrp Id -element "&ID" |
```

这生成了带有部分格式化的中间 XML：

```
  ...
  <Rec>
    <Sort>wei ch, allot a, leaman r, lu z.</Sort>
    <Name>Wei CH, Allot A, Leaman R, Lu Z.</Name>
    <Title>PubTator central: automated concept ... full text articles.</Title>
    <Source>Nucleic Acids Res.</Source>
    <Year>2019</Year>
    <Pages>.</Pages>
    <DOI>https://doi.org/10.1093/nar/gkz389.</DOI>
    <Id>(PMID 31114887.)</Id>
  </Rec>
  ...
```

参考文献按第一作者的姓氏排序：

```
  xtract -set Set -rec Rec -pattern Rec -sort Sort |
```

然后用以下命令打印：

```
  xtract -pattern Rec -deq "\n\n" -tab " " -sep "" \
    -element Name Title Source Year,Pages DOI Id
```

然后手动编辑连字符缩写：

```
  ...
  Wei C-H, Allot A, Leaman R, Lu Z. PubTator central: automated concept
  annotation for biomedical full text articles. Nucleic Acids Res. 2019.
  https://doi.org/10.1093/nar/gkz389. (PMID 31114887.)
  ...
```

使用 xtract **-reg** 和 **-exp** 正则表达式指导 xtract **-replace**：

```
  efetch -db pubmed -id 31114887 -format xml |
  xtract -pattern PubmedArticle -block Author -deq "\n" \
    -element LastName -reg "[a-z .]" -exp "" -replace ForeName
```

可以直接从 PubmedArticle 的 ForeName 字段生成连字符缩写：

```
  <Author>
    <LastName>Wei</LastName>
    <ForeName>Chih-Hsuan</ForeName>
    <Initials>CH</Initials>
  </Author>
```

通过删除小写字母、空格和句点来实现。

## 核苷酸

### 编码序列

*大肠杆菌*的乳糖操纵子中的编码序列是什么？

```
  efetch -db nuccore -id J01636.1 -format gbc |
  xtract -insd CDS gene sub_sequence
```

使用-insd "sub_sequence" 参数在特征位置下获取序列：

```
  J01636.1    lacI    GTGAAACCAGTAACGTTATACGATGTCGCAGAGTATGCCG...
  J01636.1    lacZ    ATGACCATGATTACGGATTCACTGGCCGTCGTTTTACAAC...
  J01636.1    lacY    ATGTACTATTTAAAAAACACAAACTTTTGGATGTTCGGTT...
  J01636.1    lacA    TTGAACATGCCAATGACCGAAAGAATAAGAGCAGGCAAGC...
```

### 非翻译区序列

番茄红素环化酶 mRNA 的 5'和 3' UTR 序列是什么？

```
  SubSeq() {

    xtract -pattern INSDSeq -ACC INSDSeq_accession-version -SEQ INSDSeq_sequence \
      -group INSDFeature -if INSDFeature_key -equals CDS -PRD "(-)" \
        -block INSDQualifier -if INSDQualifier_name -equals product \
          -PRD INSDQualifier_value \
        -block INSDFeature -pfc "\n" -element "&ACC" -rst \
          -first INSDInterval_from -last INSDInterval_to -element "&PRD" "&SEQ"
  }

  UTRs() {

    while IFS=$'\t' read acc fst lst prd seq
    do
      if [ $fst -gt 1 ]
      then
        echo -e ">$acc 5'UTR: 1..$((fst-1)) $prd"
        echo "${seq:1:$((fst-2))}" | fold -w 50
      else
        echo -e ">$acc NO 5'UTR"
      fi
      if [ $lst -lt ${#seq} ]
      then
        echo -e ">$acc 3'UTR: $((lst+1))..${#seq} $prd"
        echo "${seq:$lst}" | fold -w 50
      else
        echo -e ">$acc NO 3'UTR"
      fi
    done
  }

  esearch -db nuccore -query "5.5.1.19 [ECNO]" |
  efilter -molecule mrna -feature cds -source refseq |
  efetch -format gbc |
  SubSeq | UTRs
```

在起始密码子前和终止密码子后的序列通过 Unix 子字符串命令获得：

```
  >NM_001324787.1 NO 5'UTR
  >NM_001324787.1 NO 3'UTR
  >NM_001324979.1 5'UTR: 1..262 lycopene beta cyclase, chloroplastic/chromoplastic
  attatagaaatacttaagatatatcattgccctttaatcatttattttta
  actcttttaagtgtttaaagattgattctttgtacatgttctgcttcatt
  tgtgttgaaaattgagttgttttcttgaattttgcaagaatataggggac
  cccatttgtgttgaaaattgagcagctttctttgtgttttgttcgatttt
  tcaagaatataggaccccattttctgttttcttgagataaattgcacctt
  gttgggaaaat
  >NM_001324979.1 3'UTR: 1760..1782 lycopene beta cyclase, chloroplastic/chromoplastic
  attcgacttatctgggatcttgt
  ...
```

### 5 列特征表

如何从 GenBank 格式生成 5 列特征表？

```
  XtoT() {

    xtract -pattern INSDSeq -pfx ">Feature " \
        -first INSDSeqid,INSDSeq_accession-version \
      -group INSDFeature -FKEY INSDFeature_key \
        -block INSDInterval -deq "\n" \
          -element INSDInterval_from INSDInterval_to \
            INSDInterval_point INSDInterval_point \
            "&FKEY" -FKEY "()" \
        -block INSDQualifier -deq "\n\t\t\t" \
          -element INSDQualifier_name INSDQualifier_value
  }

  efetch -db nuccore -id U54469 -format gb |
  transmute -g2x |
  XtoT
```

探索 INSDSeq XML 层次结构，使用`-pattern {sequence} -group {feature} -block {qualifier}`构造，并添加适当的缩进，可以生成特征表提交格式：

```
  >Feature U54469.1
  1       2881    source
                            organism      Drosophila melanogaster
                            mol_type      genomic DNA
                            db_xref       taxon:7227
                            chromosome    3
                            map           67A8-B2
  80      2881    gene
                            gene          eIF4E
  80      224     mRNA
  892     1458
  1550    1920
  1986    2085
  2317    2404
  2466    2881
                            gene          eIF4E
                            product       eukaryotic initiation factor 4E-I
                            ...
```

包含此 xtract 命令的 **xml2tbl** 脚本现在已包含在 EDirect 中。

### WGS 组件

如何获取 WGS 项目所有组件的 FASTA 格式？

```
  GenerateWGSAccessions() {

    gb=$( efetch -db nuccore -id "$1" -format gbc < /dev/null )
    ln=$( echo "$gb" | xtract -pattern INSDSeq -element INSDSeq_length )
    pf=$(
      echo "$gb" |
      xtract -pattern INSDSeq -element INSDSeq_locus |
      sed -e 's/010*/01/g'
    )
    seq -f "${pf}%07.0f" 1 "$ln"
  }

  GenerateWGSAccessions "JABRPF000000000" |
```

返回来自 WGS 主控的扩展访问列表：

```
  JABRPF010000001
  JABRPF010000002
  JABRPF010000003
  ...
  JABRPF010000061
  JABRPF010000062
  JABRPF010000063
```

将这些访问列表管道到：

```
  efetch -db nuccore -format fasta
```

以 FASTA 格式检索各个组件：

```
  >JABRPF010000001.1 Enterococcus faecalis strain G109-2 contig00001, ...
  ACACTAATATGTGTCTTTTTAGACACTAGCTCACTAAAAAAAATAGTCATAATTTCTTCATTATTAAAAT
  CCAACAATTGTGAAATCAATTTAATATCCGATGCTTTGAAAACAACTTCTCCTTTTAATTTTTTGTAAAT
  CGTTGAAGCGGATATTGGTTGCCCGTATGCAGTCATTTCATTTGCCAACCACTCAACATTTTTTCCTTTC
  ...
```

### 某一区域的蛋白质

如何获取在特定核苷酸序列区域内编码的蛋白质记录？

```
  efetch -db nuccore -id NC_015162.1 -format gb -seq_start 9125 -seq_stop 103803 |
  xtract -insd CDS protein_id |
  cut -f 2 |
  efetch -db protein -format fasta
```

提取 protein_id 访问号并以 FASTA 格式检索这些蛋白质：

```
  >WP_013615770.1 hypothetical protein [Deinococcus proteolyticus]
  MTQNASAGLTAETLMTETGLSAAAVRRALKAYDAAFGLEHPTQDGELHLTPAEYDVLRRALQLTGGYAPG
  LKLWFGEQQALALSTQPVASPREVQQLSQLYQQVESYRARPPEEPAQTLRALLDQAQALGWSGFWEMGRL
  QGAALFVLGVLRFEDGQRAKVSMQTPLSGAEALVLSRGVCALLQRVRTQPGSGQAWSWNEVLLEEVERIL
  KDLTE
  >WP_013615771.1 hypothetical protein [Deinococcus proteolyticus]
  MNKDTNVDTAFAGGFFTTFENGECVFYDADGVCHSVTPDTVAAVVASGTPRDVVALHEDVQGRTDAVAQV
  ...
```

### 反向互补 GenBank

如何反向互补 GenBank 格式的核苷酸序列？

```
  efetch -db nuccore -id J01749 -format gb |
  gbf2fsa |
  transmute -revcomp |
  transmute -fasta -width 50
```

将 GenBank 转换为 FASTA，反向互补序列，并以每行 50 个字符的格式保存：

```
  TTCTTGAAGACGAAAGGGCCTCGTGATACGCCTATTTTTATAGGTTAATG
  TCATGATAATAATGGTTTCTTAGACGTCAGGTGGCACTTTTCGGGGAAAT
  GTGCGCGGAACCCCTATTTGTTTATTTTTCTAAATACATTCAAATATGTA
  ...
  ACGATGAGCGCATTGTTAGATTTCATACACGGTGCCTGACTGCGTTAGCA
  ATTTAACTGTGATAAACTACCGCATTAAAGCTTATCGATGATAAGCTGTC
  AAACATGAGAA
```

### 反向互补 NCBI2NA

如何反向互补 2 位编码的核苷酸序列？

```
  efetch -db nuccore -id J01749 -format asn |
  xtract -pattern Seq-entry \
    -group seq -if ncbi2na \
      -block inst -LEN length -SEQ -ncbi2na ncbi2na \
        -SUB "&SEQ[:&LEN]" -REV -revcomp "&SUB" \
        -sep "\n" -fasta "&REV"
```

扩展 NCBI2NA 表示为 IUPACNA，截断为指示的长度，反向互补该序列，并以默认的每行 70 个字符保存：

```
  TTCTTGAAGACGAAAGGGCCTCGTGATACGCCTATTTTTATAGGTTAATGTCATGATAATAATGGTTTCT
  TAGACGTCAGGTGGCACTTTTCGGGGAAATGTGCGCGGAACCCCTATTTGTTTATTTTTCTAAATACATT
  CAAATATGTATCCGCTCATGAGACAATAACCCTGATAAATGCTTCAATAATATTGAAAAAGGAAGAGTAT
  ...
  GCATAACCAAGCCTATGCCTACAGCATCCAGGGTGACGGTGCCGAGGATGACGATGAGCGCATTGTTAGA
  TTTCATACACGGTGCCTGACTGCGTTAGCAATTTAACTGTGATAAACTACCGCATTAAAGCTTATCGATG
  ATAAGCTGTCAAACATGAGAA
```

### 六框蛋白翻译

如何翻译核苷酸序列的所有六个阅读框？

```
  efetch -db nuccore -id J01749 -format fasta |
  transmute -cds2prot -circular -gcode 11 -all
```

将同时翻译三个正链和三个负链的阅读框，包括跨越原点的密码子（如果分子是环形的）：

```
  >J01749.1-1+
  FSCLTAYHR*ALMR*FITVKLLTQSGTVYE ... KCHLTSKKPLLS*H*PIKIGVSRGPFVFKN
  >J01749.1-2+
  SHV*QLIIDKL*CGSLSQLNC*RSQAPCMK ... SAT*RLRNHYYHDINL*K*AYHEALSSSRI
  >J01749.1-3+
  LMFDSLSSISFNAVVYHS*IANAVRHRV*N ... VPPDV*ETIIIMTLTYKNRRITRPFRLQEF
  >J01749.1-1-
  ILEDERAS*YAYFYRLMS***WFLRRQVAL ... FIHGA*LR*QFNCDKLPH*SLSMISCQT*E
  >J01749.1-2-
  NS*RRKGLVIRLFL*VNVMIIMVS*TSGGT ... FHTRCLTALAI*L**TTALKLIDDKLSNMR
  >J01749.1-3-
  EFLKTKGPRDTPIFIG*CHDNNGFLDVRWH ... ISYTVPDCVSNLTVINYRIKAYR**AVKHE
```

### 模式搜索

pBR322 克隆载体是一个圆形质粒，在两个抗生素抗性基因中具有唯一的限制酶位点。

`transmute -replace`函数通过修改 pBR322 rop（质粒复制数限制酶）基因的核糖体结合位点，引入第二个 BamHI 限制酶识别位点：

```
 efetch -db nuccore -id J01749 -format fasta |
  transmute -replace -offset 1907 -delete GG -insert TC |
```

`transmute -search`函数接受带有可选标签（例如限制酶名称）的序列模式列表，并使用有限状态算法同时搜索所有模式：

```
  transmute -search -circular GGATCC:BamHI GAATTC:EcoRI CTGCAG:PstI |
  align-columns -g 4 -a rl
```

然后打印（0 基）起始位置和每个匹配项的标签，形成一个两列表：

```
   374    BamHI
  1904    BamHI
  3606    PstI
  4358    EcoRI
```

**disambiguate-nucleotides** 和 **systematic-mutations** 脚本可以生成模式中的所有可能单碱基替代，以进行更宽松的搜索。

## 蛋白质

### 氨基酸组成

人类 titin 的氨基酸组成是什么？

```bash
  #!/bin/bash -norc

  AAComp() {

    abbrev=( Ala Asx Cys Asp Glu Phe Gly His Ile \
             Xle Lys Leu Met Asn Pyl Pro Gln Arg \
             Ser Thr Sec Val Trp Xxx Tyr Glx )

    tr A-Z a-z |
    sed 's/[^a-z]//g' |
    fold -w 1 |
    sort-uniq-count |
    while read num lttr
    do
      idx=$(printf %i "'$lttr'")
      ofs=$((idx-97)) 
      echo -e "${abbrev[$ofs]}\t$num"
    done |
    sort
  }

  efetch -db protein -id Q8WZ42 -format gpc |
  xtract -pattern INSDSeq -element INSDSeq_sequence |
  AAComp
```

这会使用三字母氨基酸缩写生成一个残基计数表：

```
  Ala    2084
  Arg    1640
  Asn    1111
  Asp    1720
  Cys    513
  Gln    942
  Glu    3193
  Gly    2066
  His    478
  Ile    2062
  Leu    2117
  Lys    2943
  Met    398
  Phe    908
  Pro    2517
  Ser    2463
  Thr    2546
  Trp    466
  Tyr    999
  Val    3184
```

### 最长的序列

已知最长的胰岛素前体分子是什么？

```bash
  esearch -db protein -query "insulin [PROT]" |
  efetch -format docsum |
  xtract -pattern DocumentSummary -element Caption Slen Title |
  grep -v receptor | sort -k 2,2nr | head -n 5 | cut -f 1 |
  xargs -n 1 sh -c 'efetch -db protein -id "$0" -format gp > "$0".gpf'
```

后处理排除了较长的“胰岛素样受体”序列，按序列长度排序，并使用右尖括号（“**>**”）Unix 输出重定向字符将 GenPept 结果保存到以其序列访问号命名的单个文件中：

```
  EFN61235.gpf
  EFN80340.gpf
  EGW08477.gpf
  EKC18433.gpf
  ELK28555.gpf
```

### 古细菌酶

哪些古细菌具有氯霉素乙酰转移酶？

```bash
  esearch -db protein -organism archaea \
    -query "chloramphenicol acetyltransferase [PROT]" |
  efetch -format gpc |
  xtract -pattern INSDSeq -element INSDSeq_organism INSDSeq_definition |
  grep -i chloramphenicol | grep -v MULTISPECIES |
  cut -f 1 | sort -f | uniq -i
```

根据定义行进行筛选生成古菌有机体名称列表：

```
  Euryarchaeota archaeon
  Methanobrevibacter arboriphilus
  Methanobrevibacter gottschalkii
  Methanobrevibacter millerae
  Methanobrevibacter oralis
  ...
```

## 基因

### 基因数量

每个人类染色体上有多少基因？

```bash
  for chr in {1..22} X Y MT
  do
    esearch -db gene -query "Homo sapiens [ORGN] AND $chr [CHR]" |
    efilter -status alive -type coding |
    efetch -format docsum |
    xtract -pattern DocumentSummary -NAME Name \
      -block GenomicInfoType -if ChrLoc -equals "$chr" \
        -tab "\n" -element ChrLoc,"&NAME" |
    sort | uniq | cut -f 1 |
    sort-uniq-count-rank |
    reorder-columns 2 1
  done
```

这会返回每条染色体上独特蛋白编码基因的数量：

```
  1     2011
  2     1224
  3     1046
  4     742
  5     854
  6     1015
  7     911
  8     666
  9     763
  10    718
  11    1279
  12    1012
  13    327
  14    601
  15    585
  16    835
  17    1147
  18    266
  19    1391
  20    528
  21    232
  22    429
  X     839
  Y     63
  MT    13
```

范围构造不能用于罗马数字，所以相应的*酿酒酵母*查询需要显式列出所有染色体，包括线粒体：

```bash
  for chr in I II III IV V VI VII VIII IX X XI XII XIII XIV XV XVI MT
```

质体基因可以使用“source plastid [PROP]”或`-location plastid`进行选择。

### 染色体位置

哺乳动物钙调素基因位于何处？

```bash
  esearch -db gene -query "calmodulin * [PFN] AND mammalia [ORGN]" |
  efetch -format docsum |
  xtract -pattern DocumentSummary \
    -def "-" -element Id Name MapLocation ScientificName
```

`-def`命令添加一个破折号以防止缺失数据导致表中的列偏移：

```bash
  801       CALM1     14q32.11     Homo sapiens
  808       CALM3     19q13.32     Homo sapiens
  805       CALM2     2p21         Homo sapiens
  24242     Calm1     6q32         Rattus norvegicus
  12313     Calm1     12 E         Mus musculus
  50663     Calm2     6q12         Rattus norvegicus
  24244     Calm3     1q21         Rattus norvegicus
  12315     Calm3     7 9.15 cM    Mus musculus
  12314     Calm2     17 E4        Mus musculus
  80796     Calm4     13 A1        Mus musculus
  617095    CALM1     -            Bos taurus
  396838    CALM3     -            Sus scrofa
  520277    CALM3     -            Bos taurus
  364774    Calml5    17q12.2      Rattus norvegicus
  ...
```

### 外显子数量

### 每个抗肌萎缩蛋白转录变体中有多少外显子？

以下命令从基因区域检索到一个 INSDSeq XML 子集记录，其中包含多个选择性剪接的抗肌萎缩蛋白 mRNA 和 CDS 特征。

```
  esearch -db gene -query "DMD [GENE] AND human [ORGN]" |
  efetch -format docsum |
  xtract -pattern DocumentSummary -block GenomicInfoType \
    -tab "\n" -element ChrAccVer,ChrStart,ChrStop |
  xargs -n 3 sh -c 'efetch -db nuccore -format gbc \
    -id "$0" -chr_start "$1" -chr_stop "$2"' |
```

数据提取计算每个 mRNA 位置的间隔数（包括单个外显子和不相邻的 UTRs），并从限定符中获取转录序列登录号、转录长度和产物名称：

```
  xtract -insd complete mRNA "#INSDInterval" \
    transcript_id "%transcription" product |
```

最后过滤和排序：

```
  grep -i dystrophin |
  sed 's/dystrophin, transcript variant //g' |
  sort -k 2,2nr -k 4,4nr
```

生成外显子数量和转录长度的表格：

```
  NC_000023.11    79    NM_004010.3       14083    Dp427p2
  NC_000023.11    79    NM_004009.3       14000    Dp427p1
  NC_000023.11    79    NM_004006.3       13992    Dp427m
  NC_000023.11    79    NM_000109.4       13854    Dp427c
  NC_000023.11    78    XM_006724468.2    13923    X1
  NC_000023.11    78    XM_017029328.1    13916    X4
  NC_000023.11    78    XM_006724469.3    13897    X2
  NC_000023.11    77    XM_006724470.3    13875    X3
  ...
```

### 上游序列

苯丙氨酸羟化酶基因的上游序列是什么？

```
  esearch -db nuccore -query "U49897 [ACCN]" |
  elink -target gene |
  elink -target homologene |
  elink -target gene |
  efetch -format docsum |
  xtract -pattern DocumentSummary -if GenomicInfoType -element Id \
    -block GenomicInfoType -element ChrAccVer -1-based ChrStart ChrStop |
```

这会生成一个以 1 为基数的序列坐标表：

```
  5053       NC_000012.12    102958441    102836889
  18478      NC_000076.7     87357657     87419999
  38871      NT_037436.4     7760453      7763166
  24616      NC_005106.4     28066639     28129772
  378962     NC_007115.7     17409367     17391680
  ...
```

然后，给定一个名为 "upstream.sh" 的 shell 脚本：

```
  #!/bin/bash -norc

  bases=1500
  if [ -n "$1" ]
  then
    bases="$1"
  fi

  while read id accn start stop
  do
    if [ $start -eq 0 ] || [ $stop -eq 0 ] || [ $start -eq $stop ]
    then
      echo "Skipping $id due to ambiguous coordinates"
      continue
    fi
    if [ $start -gt $stop ]
    then
      stop=$(( start + bases ))
      start=$(( start + 1 ))
      strand=2
    else
      stop=$(( start - 1 ))
      start=$(( start - bases ))
      strand=1
    fi
    rslt=$( efetch -db nuccore -id $accn -format fasta \
            -seq_start $start -seq_stop $stop -strand $strand < /dev/null )
    echo "$rslt"
  done
```

数据行可以通过以下命令管道传输：

```
  upstream.sh 500
```

提取和打印每个基因上游的 500 个核苷酸：

```
  >NC_000012.12:c102958941-102958442 Homo sapiens chromosome 12, GRCh38.p13 ...
  TGAAGTCGAGAAGCTCCTGCTCCTCGGGGCTGAGCGGGTCGTAAGAGCCCTCGTCCGACGAGTAGGATGA
  GACCGGCGAGCCGGCCATGGAGTTCAAGTCGTTGGAGTAGTTGGGGGAGATGGTGGGCGACAGGACGCCT
  GCCTGGAAGGCGGCGCTCACCGCGTCATGCTCGTCCAGCAGCTGCTGCAGCGCGCGGATGTACTCGACCG
  ...
```

## 装配

### 完整基因组

有哪些完整基因组可用于 *大肠杆菌*？

```
  esearch -db assembly -query \
    "Escherichia coli [ORGN] AND representative [PROP]" |
  elink -target nuccore -name assembly_nuccore_refseq |
  efetch -format docsum |
  xtract -pattern DocumentSummary -element AccessionVersion Slen Title |
  sed 's/,.*//' |
  sort-table -k 2,2nr
```

此搜索找到基因组装配并按序列长度排序结果，使完整基因组可以轻松与较小的质粒区分开来：

```
  NC_002695.2    5498578    Escherichia coli O157:H7 str. Sakai DNA
  NC_000913.3    4641652    Escherichia coli str. K-12 substr. MG1655
  NC_002128.1    92721      Escherichia coli O157:H7 str. Sakai plasmid pO157
  NC_002127.1    3306       Escherichia coli O157:H7 str. Sakai plasmid pOSAK1
```

sed 命令删除逗号后的文本（例如，完整基因组、完整序列、主要组装）。

类似的查询用于人类，同时过滤掉支架、重叠群和质粒：

```
  esearch -db assembly -query "Homo sapiens [ORGN] AND representative [PROP]" |
  elink -target nuccore -name assembly_nuccore_refseq |
  efetch -format docsum |
  xtract -pattern DocumentSummary -element AccessionVersion Slen Title |
  sed 's/,.*//' |
  grep -v scaffold | grep -v contig | grep -v plasmid | grep -v patch |
  sort
```

返回已组装的染色体和线粒体序列记录：

```
  NC_000001.11    248956422    Homo sapiens chromosome 1
  NC_000002.12    242193529    Homo sapiens chromosome 2
  NC_000003.12    198295559    Homo sapiens chromosome 3
  NC_000004.12    190214555    Homo sapiens chromosome 4
  NC_000005.10    181538259    Homo sapiens chromosome 5
  NC_000006.12    170805979    Homo sapiens chromosome 6
  NC_000007.14    159345973    Homo sapiens chromosome 7
  NC_000008.11    145138636    Homo sapiens chromosome 8
  NC_000009.12    138394717    Homo sapiens chromosome 9
  NC_000010.11    133797422    Homo sapiens chromosome 10
  NC_000011.10    135086622    Homo sapiens chromosome 11
  NC_000012.12    133275309    Homo sapiens chromosome 12
  NC_000013.11    114364328    Homo sapiens chromosome 13
  NC_000014.9     107043718    Homo sapiens chromosome 14
  NC_000015.10    101991189    Homo sapiens chromosome 15
  NC_000016.10    90338345     Homo sapiens chromosome 16
  NC_000017.11    83257441     Homo sapiens chromosome 17
  NC_000018.10    80373285     Homo sapiens chromosome 18
  NC_000019.10    58617616     Homo sapiens chromosome 19
  NC_000020.11    64444167     Homo sapiens chromosome 20
  NC_000021.9     46709983     Homo sapiens chromosome 21
  NC_000022.11    50818468     Homo sapiens chromosome 22
  NC_000023.11    156040895    Homo sapiens chromosome X
  NC_000024.10    57227415     Homo sapiens chromosome Y
  NC_012920.1     16569        Homo sapiens mitochondrion
```

### 该过程可以自动化，以循环遍历指定的生物体列表：

```
  for org in \
    "Agrobacterium tumefaciens" \
    "Bacillus anthracis" \
    "Escherichia coli" \
    "Neisseria gonorrhoeae" \
    "Pseudomonas aeruginosa" \
    "Shigella flexneri" \
    "Streptococcus pneumoniae"
  do
    esearch -db assembly -query "$org [ORGN]" |
    efilter -query "representative [PROP]" |
    elink -target nuccore -name assembly_nuccore_refseq |
    efetch -format docsum |
    xtract -pattern DocumentSummary -element AccessionVersion Slen Title |
    sed 's/,.*//' |
    grep -v -i -e scaffold -e contig -e plasmid -e sequence -e patch |
    sort-table -k 2,2nr
  done
```

这将生成：

```
  NC_011985.1    4005130    Agrobacterium radiobacter K84 chromosome 1
  NC_011983.1    2650913    Agrobacterium radiobacter K84 chromosome 2
  NC_005945.1    5228663    Bacillus anthracis str. Sterne chromosome
  NC_003997.3    5227293    Bacillus anthracis str. Ames chromosome
  NC_002695.1    5498450    Escherichia coli O157:H7 str. Sakai chromosome
  NC_018658.1    5273097    Escherichia coli O104:H4 str. 2011C-3493 ...
  NC_011751.1    5202090    Escherichia coli UMN026 chromosome
  NC_011750.1    5132068    Escherichia coli IAI39 chromosome
  NC_017634.1    4747819    Escherichia coli O83:H1 str. NRG 857C chromosome
  NC_000913.3    4641652    Escherichia coli str. K-12 substr. MG1655
  NC_002946.2    2153922    Neisseria gonorrhoeae FA 1090 chromosome
  NC_002516.2    6264404    Pseudomonas aeruginosa PAO1 chromosome
  NC_004337.2    4607202    Shigella flexneri 2a str. 301 chromosome
  NC_003028.3    2160842    Streptococcus pneumoniae TIGR4 chromosome
  NC_003098.1    2038615    Streptococcus pneumoniae R6 chromosome
```

## SNP

### SNP 数据表

如何从文档摘要中获取 SNP 属性的制表符分隔表？

```
  efetch -db snp -id 11549407 -format docsum |
  snp2tbl
```

**snp2tbl** 脚本从 HGVS 数据中提取字段并打印各个值以供进一步处理：

```
  rs11549407    NC_000011.10    5226773    G    A    Genomic    Substitution    HBB
  rs11549407    NC_000011.10    5226773    G    C    Genomic    Substitution    HBB
  rs11549407    NC_000011.10    5226773    G    T    Genomic    Substitution    HBB
  rs11549407    NG_000007.3     70841      C    A    Genomic    Substitution    HBB
  rs11549407    NG_000007.3     70841      C    G    Genomic    Substitution    HBB
  rs11549407    NG_000007.3     70841      C    T    Genomic    Substitution    HBB
  ... 
  rs11549407    NM_000518.5     167        C    A    Coding     Substitution    HBB
  rs11549407    NM_000518.5     167        C    G    Coding     Substitution    HBB
  rs11549407    NM_000518.5     167        C    T    Coding     Substitution    HBB
  rs11549407    NP_000509.1     39         Q    *    Protein    Termination     HBB
  rs11549407    NP_000509.1     39         Q    E    Protein    Missense        HBB
  rs11549407    NP_000509.1     39         Q    K    Protein    Missense        HBB
```

列为 SNP 标识符、登录号、版本、序列起始偏移量、删除的字母、插入的字母、序列类别、变异类型和基因名称。内部步骤（**snp2hgvs**、**hgvs2spdi** 和 **spdi2tbl**）如下所述。

### 氨基酸取代

绿敏感视蛋白的错义产物是什么？

```
  esearch -db gene -query "OPN1MW [PREF] AND human [ORGN]" |
  elink -target snp | efilter -class missense |
  efetch -format docsum |
```

SNP 文档摘要包含以下形式的 HGVS 数据：

```
  NC_000023.11:g.154193517C>A, ... ,NP_000504.1:p.Ala285Val
```

可以通过 xtract **‑hgvs** 命令在 **snp2hgvs** 脚本中解析为：

```
  snp2hgvs |
```

将核苷酸和氨基酸替换的结构化表示：

```
  ...
  <HGVS>
    <Id>782327292</Id>
    <Gene>OPN1MW</Gene>
    <Variant>
      <Class>Genomic</Class>
      <Type>Substitution</Type>
      <Accession>NC_000023.11</Accession>
      <Position>154193516</Position>
      <Deleted>C</Deleted>
      <Inserted>A</Inserted>
      <Hgvs>NC_000023.11:g.154193517C&gt;A</Hgvs>
    </Variant>
    ...
    <Variant>
      <Class>Coding</Class>
      <Type>Substitution</Type>
      <Accession>NM_000513.2</Accession>
      <Offset>853</Offset>
      <Deleted>C</Deleted>
      <Inserted>T</Inserted>
      <Hgvs>NM_000513.2:c.854C&gt;T</Hgvs>
    </Variant>
    <Variant>
      <Class>Protein</Class>
      <Type>Missense</Type>
      <Accession>NP_000504.1</Accession>
      <Position>284</Position>
      <Deleted>A</Deleted>
      <Inserted>D</Inserted>
      <Hgvs>NP_000504.1:p.Ala285Asp</Hgvs>
    </Variant>
    <Variant>
      <Class>Protein</Class>
      <Type>Missense</Type>
      <Accession>NP_000504.1</Accession>
      <Position>284</Position>
      <Deleted>A</Deleted>
      <Inserted>V</Inserted>
      <Hgvs>NP_000504.1:p.Ala285Val</Hgvs>
    </Variant>
  </HGVS>
  ...
```

原始的 1 基准 HGVS 位置在 XML 中转换为 0 基准。

将这些结果传递通过 **hgvs2spdi** 脚本：

```
  hgvs2spdi |
```

将 CDS 相对偏移量转换为序列相对位置：

```
  ...
  <SPDI>
    <Id>782327292</Id>
    <Gene>OPN1MW</Gene>
    ...
    <Variant>
      <Class>Coding</Class>
      <Type>Substitution</Type>
      <Accession>NM_000513.2</Accession>
      <Position>935</Position>
      <Offset>853</Offset>
      <Deleted>C</Deleted>
      <Inserted>A</Inserted>
      <Hgvs>NM_000513.2:c.854C&gt;A</Hgvs>
      <Spdi>NM_000513.2:935:C:A</Spdi>
    </Variant>
    <Variant>
      <Class>Coding</Class>
      <Type>Substitution</Type>
      <Accession>NM_000513.2</Accession>
      <Position>935</Position>
      <Offset>853</Offset>
      <Deleted>C</Deleted>
      <Inserted>T</Inserted>
      <Hgvs>NM_000513.2:c.854C&gt;T</Hgvs>
      <Spdi>NM_000513.2:935:C:T</Spdi>
    </Variant>
    ...
  </SPDI>
  ...
```

将这些数据通过 **spdi2tbl** 脚本处理：

```
  spdi2tbl |
```

完成 **snp2tbl** 流程的最后一步，生成一个 SNP 数据表。通过以下命令进行过滤：

```
  grep Protein | grep Missense | cut -f 1-5
```

得到按登录号、位置和残基排序的氨基酸替换表：

```
  rs1238141906    NP_000504.1    40    E    K
  rs1189783086    NP_000504.1    42    P    L
  rs1257135801    NP_000504.1    45    H    Y
  rs1284438666    NP_000504.1    63    V    I
  rs1223726997    NP_000504.1    64    I    T
  ...
```

这些行在一个 while 循环中处理，缓存当前序列数据：

```
  while read rsid accn ofs del ins
  do
    if [ "$accn" != "$last" ]
    then
      seq=$( efetch -db protein -id "$accn" -format gpc < /dev/null |
             xtract -pattern INSDSeq -lower INSDSeq_sequence )
      last="$accn"
    fi
    pos=$((ofs + 1))
    echo ">$rsid [$accn $ins@$pos]"
    echo "$seq" |
    transmute -replace -offset "$ofs" -delete "$del" -insert "$ins" -lower |
    fold -w 50
  done
```

并使用 transmute **‑replace** 生成在替换残基处以大写形式显示的修改后的 FASTA 文件：

```
  >rs1238141906 [NP_000504.1 K@41]
  maqqwslqrlagrhpqdsyedstqssiftytnsnstrgpfKgpnyhiapr
  wvyhltsvwmifvviasvftnglvlaatmkfkklrhplnwilvnlavadl
  aetviastisvvnqvygyfvlghpmcvlegytvslcgitglwslaiiswe
  ...
```

### SNP 修饰产物对

如何匹配密码子修改和氨基酸替换？

```
  efetch -db snp -id 11549407 -format docsum |
  snp2tbl |
  tbl2prod
```

对于在同一位置具有不同替换的 SNP，**tbl2prod** 脚本翻译编码序列（在核苷酸修改后），并与蛋白质序列（在残基替换后）排序，生成相邻匹配的 CDS/蛋白质对：

```
  rs11549407    NM_000518.5:167:C:T    MVHLTPEEKSAVTALWGKVNVDEVGGEALGRLLVVYPWT*R...
  rs11549407    NP_000509.1:39:Q:*     MVHLTPEEKSAVTALWGKVNVDEVGGEALGRLLVVYPWT*R...
  rs11549407    NM_000518.5:167:C:G    MVHLTPEEKSAVTALWGKVNVDEVGGEALGRLLVVYPWTER...
  rs11549407    NP_000509.1:39:Q:E     MVHLTPEEKSAVTALWGKVNVDEVGGEALGRLLVVYPWTER...
  rs11549407    NM_000518.5:167:C:A    MVHLTPEEKSAVTALWGKVNVDEVGGEALGRLLVVYPWTKR...
  rs11549407    NP_000509.1:39:Q:K     MVHLTPEEKSAVTALWGKVNVDEVGGEALGRLLVVYPWTKR...
  rs11549407    NM_000518.5:167:C:+    MVHLTPEEKSAVTALWGKVNVDEVGGEALGRLLVVYPWTQR...
  rs11549407    NP_000509.1:39:Q:+     MVHLTPEEKSAVTALWGKVNVDEVGGEALGRLLVVYPWTQR...
```

“**+**” 号表示未修改的“野生型”核苷酸或氨基酸。

## 结构

### 结构相似性

哪些古菌结构与蛇毒磷脂酶相似？

```
  esearch -db structure -query "crotalus [ORGN] AND phospholipase A2" |
  elink -related |
  efilter -query "archaea [ORGN]" |
  efetch -format docsum |
  xtract -pattern DocumentSummary \
    -if PdbClass -equals Hydrolase \
      -element PdbDescr |
  sort -f | uniq -i
```

结构邻居使用几何比较找到蛋白质，这些蛋白质与通过 BLAST 搜索找到的序列相似性不同：

```
  Crystal Structure Of Autoprocessed Form Of Tk-Subtilisin
  Crystal Structure Of Ca2 Site Mutant Of Pro-S324a
  Crystal Structure Of Ca3 Site Mutant Of Pro-S324a
  ...
```

## 分类

### 分类谱系

人类的主要分类谱系节点是什么？

```
  efetch -db taxonomy -id 9606 -format xml |
  xtract -pattern Taxon -first TaxId -tab "\n" -element ScientificName \
    -block "**/Taxon" \
      -if Rank -is-not "no rank" -and Rank -is-not clade \
        -tab "\n" -element Rank,ScientificName
```

这使用双星/子级结构递归地探索数据层次结构：

```
  9606            Homo sapiens
  superkingdom    Eukaryota
  kingdom         Metazoa
  phylum          Chordata
  subphylum       Craniata
  superclass      Sarcopterygii
  class           Mammalia
  superorder      Euarchontoglires
  order           Primates
  ...
```

### 分类搜索

哪些生物体包含注释的 RefSeq 基因组 MatK 基因？

```
  esearch -db nuccore -query "MatK [GENE] AND NC_0:NC_999999999 [PACC]" |
  efetch -format docsum |
  xtract -pattern DocumentSummary -element TaxId |
  sort -n | uniq |
  epost -db taxonomy |
  efetch -format docsum |
  xtract -pattern DocumentSummary -element ScientificName |
  sort
```

第一个查询从核苷酸文档摘要中获取分类 UID，并将其上传以便从分类数据库中单独检索：

```
  Acidosasa purpurea
  Acorus americanus
  ...
  Zingiber spectabile
  Zygnema circumcarinatum
```

## 生物样本

生物样本文档摘要：

```
  esummary -db biosample -id SAMN34375013 |
```

使用 XML 属性来识别数据元素类型：

```
  <Attribute attribute_name="strain" harmonized_name="strain" ...>KF24</Attribute>
```

一个两阶段 xtract 管道可以生成制表符分隔的表格，每列对应一个选定字段。将数据传输到第一个命令：

```
  xtract -rec BioSampleInfo -pattern DocumentSummary \
    -wrp Accession -element Accession \
    -wrp Title -element DocumentSummary/Title \
    -wrp Link -sep "|" -numeric Links/Link \
    -group Attribute -if @harmonized_name \
      -TAG -lower @harmonized_name -wrp "&TAG" -element Attribute |
```

生成一个中间形式，使用来自 "harmonized_name" 属性的 XML 对象名称：

```
  <BioSampleInfo>
    <Accession>SAMN34375013</Accession>
    <Title>Microbe sample from Bacillus subtilis</Title>
    <Link>960711</Link>
    <isolation_source>rhizosphere soil</isolation_source>
    <collection_date>missing</collection_date>
    <geo_loc_name>China: Kaifeng, Henan Province</geo_loc_name>
    <sample_type>bacterial isolate</sample_type>
    <lat_lon>34.14 N 114.05 E</lat_lon>
    <strain>KF24</strain>
  </BioSampleInfo>
```

（一个包含此第一个 xtract 命令的 **bsmp2info** 脚本现已包含在 EDirect 中。）

然后可以在第二个 xtract 命令的最后一行中按名称选择所需字段，对于任何缺失值打印一个 "-" 占位符：

```
  xtract -pattern BioSampleInfo -def "-" -first Accession Title Link \
    geo_loc_name isolation_source strain lat_lon
```

使用 ‑first 而不是 ‑element 消除了在属性名称从 "country" 转变为 "geo_loc_name" 期间可能出现的重复条目。

## SRA

### 使用 RunInfo 格式

SRA 数据可以以 RunInfo 格式检索：

```
  efetch -db sra -id SRR6314034 -format runinfo |
```

以逗号分隔的值，第一行包含字段名称：

```
  Run,ReleaseDate,LoadDate,spots,bases,spots_with_mates,avgLength,...
  SRR6314034,2017-11-21 23:27:11,2017-11-21 23:25:38,128,539118,0,...
```

通过 **csv2xml** 脚本，并使用 ‑header 标志：

```
  csv2xml -set Set -rec Rec -header |
```

将数据转换为 XML：

```
  <Set>
    <Rec>
      <Run>SRR6314034</Run>
      <ReleaseDate>2017-11-21 23:27:11</ReleaseDate>
      <LoadDate>2017-11-21 23:25:38</LoadDate>
      <spots>128</spots>
      <bases>539118</bases>
      <spots_with_mates>0</spots_with_mates>
      <avgLength>4211</avgLength>
      <size_MB>0</size_MB>
      <AssemblyName></AssemblyName>
      <download_path>...</download_path>
      <Experiment>SRX3413965</Experiment>
      <LibraryName>child</LibraryName>
      <LibraryStrategy>AMPLICON</LibraryStrategy>
      <LibrarySelection>PCR</LibrarySelection>
      <LibrarySource>GENOMIC</LibrarySource>
      <LibraryLayout>SINGLE</LibraryLayout>
      <InsertSize>0</InsertSize>
      <InsertDev>0</InsertDev>
      <Platform>PACBIO_SMRT</Platform>
      <Model>PacBio RS II</Model>
      <SRAStudy>SRP125431</SRAStudy>
      <BioProject>PRJNA418990</BioProject>
      <Study_Pubmed_id></Study_Pubmed_id>
      <ProjectID>418990</ProjectID>
      <Sample>SRS2707133</Sample>
      <BioSample>SAMN08040264</BioSample>
      <SampleType>simple</SampleType>
      <TaxID>9606</TaxID>
      <ScientificName>Homo sapiens</ScientificName>
      <SampleName>BBS9_del_mother</SampleName>
      <g1k_pop_code></g1k_pop_code>
      <source></source>
      <g1k_analysis_group></g1k_analysis_group>
      <Subject_ID></Subject_ID>
      <Sex>female</Sex>
      <Disease></Disease>
      <Tumor>no</Tumor>
      <Affection_Status></Affection_Status>
      <Analyte_Type></Analyte_Type>
      <Histological_Type></Histological_Type>
      <Body_Site></Body_Site>
      <CenterName>ICAHN SCHOOL OF MEDICINE AT MOUNT SINAI</CenterName>
      <Submission>SRA633054</Submission>
      <dbgap_study_accession></dbgap_study_accession>
      <Consent>public</Consent>
      <RunHash>19AC4EB8A65D733274756464DCCF65EA</RunHash>
      <ReadHash>AC8F39C51F95D9CD1BD0CBFBB669AD1E</ReadHash>
    </Rec>
  </Set>
```

然后可以通过 xtract 管道：

```
  xtract -pattern Rec -def "-" -element Run Experiment BioProject BioSample
```

按字段名称检索所需的值：

```
  SRR6314034    SRX3413965    PRJNA418990    SAMN08040264
```

### 在云上安装 EDirect

要安装 EDirect 软件，打开终端窗口并执行以下命令：

```
  sh -c "$(curl -fsSL https://ftp.ncbi.nlm.nih.gov/entrez/entrezdirect/install-edirect.sh)"
```

在安装结束时，回答 "y" 让脚本运行 PATH 更新命令以编辑配置文件，以便在后续终端会话中可以运行 EDirect 程序。

安装完成后，运行：

```
  export PATH=${PATH}:${HOME}/edirect
```

为当前终端会话设置 PATH。

### 下载 BLAST 软件

获取 Magic-BLAST 软件（如果尚未安装）：

```
  download-ncbi-software magic-blast
```

### 准备染色体文件

检索人类 7 号染色体的序列：

```
  efetch -db nuccore -id NC_000007 -format fasta -immediate > NC_000007.fsa
```

以文档摘要格式下载人类 7 号染色体上的蛋白质编码基因，并将基因范围提取到制表符分隔的表格中：

```
  esearch -db gene -query "Homo sapiens [ORGN] AND 7 [CHR]" |
  efilter -status alive -type coding | efetch -format docsum |
  gene2range "7" > NC_000007.gen
```

### SRA 基因分析

对 SRR6314034 与 7 号染色体运行 **magicblast** 搜索：

```
  magicblast -sra SRR6314034 -subject NC_000007.fsa -outfmt asn |
  asn2xml > SRR6314034.xml
```

将比对详情通过 **blst2tkns** 脚本：

```
  cat SRR6314034.xml |
  blst2tkns |
```

标记比对部分：

```
  index          1
  score          6268
  start          33088037
  stop           33167397
  strand         plus
  match          12
  mismatch       1
  genomic-ins    1
  ...
```

将这些数据通过 **split-at-intron** 脚本处理：

```
  split-at-intron |
```

检测大规模基因组插入：

```
  6268    1    plus    33088037..33091003,33163798..33167397
  4910    2    plus    33089462..33091003,33163799..33167397
  1814    3    plus    33164965..33167397
  ...
```

通过以下命令按最小分数进行过滤：

```
  filter-columns '$1 > 1000' |
```

然后 **fuse-ranges** 脚本将重叠的比对合并：

```
  fuse-ranges |
```

成为最小的扩展区间集：

```
  plus     33088037    33091003    2967
  plus     33163798    33167398    3601
  plus     33272248    33272278    31
  plus     33394238    33394551    314
  minus    33088037    33091004    2968
  minus    33163798    33167398    3601
  minus    33255886    33256012    127
  minus    33394326    33394551    226
```

将每个区间通过 **find-in-gene** 脚本处理：

```
  while read std min max len
  do
    cat NC_000007.gen |
    find-in-gene "$std" "$min" "$max"
  done |
  sort -f | uniq -i
```

返回重叠比对片段的基因名称：

```
  BBS9
```

## PubChem

### PubChem 在 Entrez 中

Entrez 可以根据化合物的完整同义词进行搜索：

```
  esearch -db pccompound -query "catechol [CSYN]" |
  efetch -format uid
```

返回少量密切匹配的化合物标识符（CIDs）：

```
  73160
  9064
  289
```

化合物的 Entrez 文档摘要：

```
  efetch -db pccompound -id 289 -format docsum |
  xtract -pattern DocumentSummary -element MolecularFormula IsomericSmiles
```

包含化合物的通用描述信息字段：

```
  C6H6O2    C1=CC=C(C(=C1)O)O
```

### Power User Gateway (PUG) REST 查询表单

PubChem 还支持用于更高级查询的 RESTful 服务。Nquire 提供了一个 ‑pugrest URL 快捷方式。搜索请求的基本形式是：

```
  nquire -pugrest [compound|substance|assay] [input] [operation] [output]
```

搜索可以使用化合物名称：

```
  nquire -pugrest compound name catechol cids TXT
```

以获取最佳匹配的化合物标识符：

```
  289
```

可以使用 CID 作为输入键来获取标题和描述：

```
  nquire -pugrest compound cid 289 description XML
```

或检索更详细的记录：

```
  nquire -pugrest compound cid 289 record XML |
```

包含规范或异构 SMILES 代码：

```
  xtract -pattern PC-InfoData \
    -if PC-Urn_label -equals SMILES -and PC-Urn_name -equals Isomeric \
      -element PC-InfoData_value_sval
```

### PubChem 化学标识符

某些标识符类型需要 POST 参数来编码特殊符号：

```
  nquire -pugrest compound smiles description XML \
    -smiles "C1=CC=C(C(=C1)O)O" |
  xtract -pattern InformationList -element Title Description
```

返回化学名称和描述：

```
  Catechol    Catechol is a benzenediol comprising...
```

其他需要在单独参数中编码的标识符键类型如下所示：

```
  nquire -pugrest compound inchi synonyms TXT \
    -inchi "1S/C6H6O2/c7-5-3-1-2-4-6(5)8/h1-4,7-8H"

  nquire -pugrest compound inchikey cids JSON \
    -inchikey "YCIMNLLNPGFGHC-UHFFFAOYSA-N"

  nquire -pugrest compound/fastsubstructure/smarts/cids/XML \
    -smarts "[#7]-[#6]-1=[#6]-[#6](C#C)=[#6](-[#6]-[#8])-[#6]=[#6]-1"
```

（Nquire ‑inchi 如果参数字符串中缺少 "InChI=" 前缀，将提供预期的 "InChI=" 前缀。）

### PUG-REST 异步查询

一些 PUG-REST 查询计算量大，异步运行：

```
  nquire -pugrest compound/superstructure/cid/2244/XML |
```

返回的 `<ListKey>` 令牌传递给 nquire ‑pugwait 命令，后者轮询服务器直到结果可用：

```
  nquire -pugwait
```

然后下载标识符并直接放入 ENTREZ_DIRECT 消息中：

```
  <ENTREZ_DIRECT>
    <Db>pccompound</Db>
    <Count>3750</Count>
    <Id>87</Id>
    <Id>175</Id>
    <Id>176</Id>
    ...
    <Id>162400221</Id>
    <Id>162416056</Id>
    <Id>162417911</Id>
  </ENTREZ_DIRECT>
```

在 2020 年重新设计 EDirect 时添加了对这种形式的支持。

## 文献计量学

### 倒序排列

重新打包整个文档摘要并创建用于排序的一组键：

```
  esearch -db pubmed -query "tn3 transposition immunity" |
  efetch -format docsum |
  xtract -rec Rec -pattern DocumentSummary -INDX "+" \
    -group DocumentSummary -pkg SortKeys \
      -unit DocumentSummary -wrp INDX -element "&INDX" \
      -unit PubDate -wrp YEAR -year PubDate \
      -unit PubDate -wrp DATE -date "*" \
      -unit Title -wrp TITL -lower Title \
      -unit Author -position first -wrp FAUT -lower Name \
      -unit Author -position last -wrp LAUT -lower Name \
      -unit Authors -wrp ANUM -num Author/Name \
      -unit DocumentSummary -wrp SIZE -len "*" \
    -group DocumentSummary -pkg DS -element "*" |
```

生成一个中间结构，带有用于排序键的独立容器和原始 docsum：

```
  ...
  <Rec>
    <SortKeys>
      <INDX>5</INDX>
      <YEAR>1989</YEAR>
      <DATE>1989/04</DATE>
      <TITL>nucleotide sequences required for tn3 transposition immunity.</TITL>
      <FAUT>kans ja</FAUT>
      <LAUT>casadaban mj</LAUT>
      <ANUM>2</ANUM>
      <SIZE>1695</SIZE>
    </SortKeys>
    <DS>
      <DocumentSummary>
        <Id>2539356</Id>
        <PubDate>1989 Apr</PubDate>
        <Source>J Bacteriol</Source>
        ...
      </DocumentSummary>
    </DS>
  </Rec>
  ...
```

这允许按从 ‑year 派生的新标签排序记录：

```
  xtract -rec Rec -pattern Rec -sort-rev SortKeys/YEAR |
  xtract -set DocumentSummarySet -pattern Rec \
    -group DS/DocumentSummary -element "*" |
  transmute -format -combine |
  xtract -pattern DocumentSummary -element Id PubDate
```

以按出版日期倒序展示记录：

```
  36257990    2022 Oct 18
  28096365    2017 Jan 31
  22624153    2012 Feb
  21729108    2011 Sep
  8595595     1996 Jan
```

### 计算唯一期刊数

一些文献计量分析需要获取大量 PubMed 记录。一个这样的例子是计算在给定类别下发布论文的唯一期刊数量。

一个通用函数整合代码以执行查询并从 EDirect 本地 PubMed 存档中获取记录。xtract **‑histogram** 快捷方式充当 ‑element 命令，后跟内置的排序-唯一-计数。（当结果数量以百万计时，这可以节省大量时间。）行数给出了发布至少一篇满足查询条件的论文的期刊数量：

```
  CountUniqueJournals() {

    qry="$1"

    # 计算匹配查询条件的论文的唯一期刊数
    phrase-search -db pubmed -query "$qry" | fetch-pubmed |
    xtract -pattern PubmedArticle -histogram Journal/ISOAbbreviation |
    wc -l | tr -d ' '
  }
```

遍历一系列年份，并使用查询中的过滤条件调用此函数：

```
  for year in {2016..2022}
  do

    # 查找仍使用非结构化日期的期刊百分比
    filt="medline date [PROP]" 
    base="journal article [PTYP] AND $year [YEAR]" 

    # 发布带有过滤条件的论文的期刊子集
    subs=$( CountUniqueJournals "$base AND $filt" ) 

    # 选定出版类型中的唯一期刊数
    totl=$( CountUniqueJournals "$base" ) 

    frac="-"
    if [ "$totl" -gt 0 ] 
    then
      # 计算（整数）百分比
      frac=$((subs * 100 / totl)) 
    fi

    # 打印年份、期刊数和使用过滤条件的百分比
    printf "$year\t$subs\t$totl\t$frac\n"

  done | align-columns -h 2 -g 4 -a r
```

返回年份、该年份带有过滤条件和总计的唯一期刊数，以及两者的百分比。在此示例中，最后一列显示了提供非结构化出版日期的期刊百分比稳步下降：

```
  2016    1933    10362    18
  2017    1153    10473    11
  2018    1071    10321    10
  2019     980    10027     9
  2020     919    10579     8
  2021     950    10947     8
  2022     835    10600     7
```

[版权声明](https://www.ncbi.nlm.nih.gov/books/about/copyright/)

书架编号：NBK565821
