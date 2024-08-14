<!DOCTYPE html>
<html lang='<?= $kirby->language()->code() ?>'>

<head>
  <meta charset='UTF-8'>
  <meta http-equiv='X-UA-Compatible' content='IE=edge'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>

  <title><?= r(!$page->isHomePage(), $page->title()->html() . ' | ') . $site->title()->html() ?></title>
  <?php snippet('html/metas') ?>

  <?= vite()->js('index.js', ['defer' => true]) ?>
  <?= vite()->css('index.scss') ?>

  <script>
    document.getElementsByTagName('html')[0].className = 'js'
  </script>
</head>

<body data-barba='wrapper'>
