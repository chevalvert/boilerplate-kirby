<?php snippet('html/header') ?>

<main>
  <div>Hello from <?= isWebpack() ? 'Webpack' : 'not Webpack' ?></div>
  <div>Hello from PHP</div>
</main>

<?php snippet('html/footer') ?>
