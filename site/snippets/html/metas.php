<link rel='icon' type='image/png' sizes='32x32' href='assets/favicons/favicon-32x32.png'>

<meta name='application-name' content='<?= $site->title() ?>'>
<meta name='description' content='<?= $site->description()->html() ?>'>
<meta name='keywords' content='<?= $site->keywords()->html() ?>'>

<meta property='og:url' content='<?= $site->url() ?>'>
<meta property='og:type' content='website'>
<meta property='og:title' content='<?= r($page !== $site->homePage(), $page->title()->html() . ' | ') . $site->title()->html() ?>'>
<meta property='og:description' content='<?= $site->description()->html() ?>'>
<meta property='og:site_name' content='<?= $site->title() ?>'>
<meta property='og:locale' content='fr'>

<meta name='twitter:card' content='summary'>
<meta name='twitter:url' content='<?= $site->url() ?>'>
<meta name='twitter:title' content='<?= r($page !== $site->homePage(), $page->title()->html() . ' | ') . $site->title()->html() ?>'>
<meta name='twitter:description' content='<?= $site->description()->html() ?>'>

<?php if ($cover = $site->cover()->toFile()) : ?>
  <meta property='og:image' content='<?= $cover->url() ?>'>
  <meta property='og:image:width' content='<?= $cover->width() ?>'>
  <meta property='og:image:height' content='<?= $cover->height() ?>'>
  <meta name='twitter:image' content='<?= $cover->url() ?>'>
<?php endif ?>
