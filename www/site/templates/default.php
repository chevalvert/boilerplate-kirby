<?php snippet('html/header') ?>

<main>
  <div>Hello from <?= isWebpack() ? 'Webpack' : 'not Webpack' ?></div>
  <div>Hello from PHP</div>
</main>

<?= js('assets/builds/common.js') ?>
<?php snippet('html/footer') ?>
