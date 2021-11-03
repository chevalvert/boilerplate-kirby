<!DOCTYPE html>
<html lang='fr'>
<head>
  <meta charset='utf-8'>
  <meta name='viewport' content='width=device-width,initial-scale=1.0,minimal-ui'>
  <meta http-equiv='X-UA-Compatible' content='IE=edge,chrome=1'>
  <meta http-equiv='cleartype' content='on'>

  <title><?= r($page !== $site->homePage(), ($title ?? $page->title()->html()) . ' | ') . $site->title()->html() ?></title>
  <?= liveCSS('assets/builds/bundle.css') ?>

  <script>document.getElementsByTagName('html')[0].className = 'js'</script>
  <script type='text/javascript'>
    window.ENV = {
      production:
        !!~window.location.hash.indexOf('#production') ||
        (<?= json_encode(!isWebpack()) ?> && !~window.location.hash.indexOf('#dev'))
    }
  </script>
</head>
<body data-template='<?= $page->intendedTemplate() ?>'>
