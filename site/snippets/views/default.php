<?php snippet('components/Article', [
  'title' => $page->title()
], slots: true) ?>

  <?php slot('content') ?>
    <div class='prose'>
      <?= $page->text()->kirbytext() ?>
    </div>
  <?php endslot() ?>

  <?php slot('footer') ?>
    <?php
      snippet('components/Hello', ['firstname' => 'Stéphane']);
      snippet('components/Hello', ['firstname' => 'Arnaud']);
      snippet('components/Hello');
    ?>
  <?php endslot() ?>

<?php endsnippet() ?>
