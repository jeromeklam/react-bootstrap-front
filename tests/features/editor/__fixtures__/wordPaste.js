/**
 * Collage typique depuis Microsoft Word / Outlook.
 * Reproduit fidèlement ce que le presse-papier livre : commentaires
 * conditionnels, feuille de style embarquée, classes Mso*, <o:p>, spans en
 * cascade et déclarations mso-* dans les styles inline.
 */
export const WORD_PASTE = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
xmlns:w="urn:schemas-microsoft-com:office:word">
<head>
<meta http-equiv=Content-Type content="text/html; charset=windows-1252">
<meta name=Generator content="Microsoft Word 15">
<!--[if gte mso 9]><xml>
 <o:OfficeDocumentSettings>
  <o:AllowPNG/>
 </o:OfficeDocumentSettings>
</xml><![endif]-->
<style>
<!--
 /* Font Definitions */
 @font-face
	{font-family:"Cambria Math";
	panose-1:2 4 5 3 5 4 6 3 2 4;}
p.MsoNormal, li.MsoNormal, div.MsoNormal
	{margin:0cm;
	font-size:11.0pt;
	font-family:"Calibri",sans-serif;}
-->
</style>
</head>
<body lang=FR style='word-wrap:break-word'>
<!--StartFragment-->
<div class=WordSection1>
<p class=MsoNormal style='margin-bottom:0cm;line-height:normal'><span
style='font-size:11.0pt;font-family:"Calibri",sans-serif;mso-fareast-font-family:
"Times New Roman";color:windowtext;mso-ansi-language:FR'>Bonjour,<o:p></o:p></span></p>
<p class=MsoNormal><o:p>&nbsp;</o:p></p>
<p class=MsoNormal style='text-align:justify'><span style='font-size:11.0pt;
font-family:"Calibri",sans-serif;color:#C00000;mso-no-proof:yes'><b>Merci</b>
pour votre <span style='mso-spacerun:yes'> </span>soutien</span><span
style='font-size:11.0pt;font-family:"Calibri",sans-serif'>.<o:p></o:p></span></p>
<p class=MsoListParagraph style='margin-left:36.0pt;text-indent:-18.0pt;
mso-list:l0 level1 lfo1'><![if !supportLists]><span style='font-family:Symbol'>·<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp; </span></span><![endif]><span
style='font-size:11.0pt'>Premier point</span></p>
</div>
<!--EndFragment-->
</body>
</html>`;
