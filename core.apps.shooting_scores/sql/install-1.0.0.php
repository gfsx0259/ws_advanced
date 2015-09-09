<?php

$db = mysql::get_instance();
$db->query("
     CREATE TABLE `ext_shooting_scores` (
    `id`  int(10) UNSIGNED NOT NULL AUTO_INCREMENT ,
    `data_key`  varchar(64) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
    `date`  varchar(10) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
    `name`  varchar(64) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '' ,
    `target_1`  float NOT NULL DEFAULT 0 ,
    `target_2`  float NOT NULL DEFAULT 0 ,
    `target_3`  float NOT NULL DEFAULT 0 ,
    `target_total`  float NOT NULL DEFAULT 0 ,
    `group_1`  float NOT NULL DEFAULT 0 ,
    `group_2`  float NOT NULL DEFAULT 0 ,
    `group_3`  float NOT NULL DEFAULT 0 ,
    `group_average`  float NOT NULL DEFAULT 0 ,
    `primer`  varchar(64) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
    `action`  varchar(64) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
    `caliber`  varchar(64) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
    `bullets`  varchar(64) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
    `barrel`  varchar(64) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
    `powder`  varchar(64) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
    `gunsmith`  varchar(64) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
    `scope`  varchar(64) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
    `stock`  varchar(64) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
    `blind`  varchar(64) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
    `picture_1`  varchar(80) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
    `picture_2`  varchar(80) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
    `picture_3`  varchar(80) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
    PRIMARY KEY (`id`),
    INDEX `site_id_data_key` (`data_key`) USING BTREE
    )
    ENGINE=MyISAM
    DEFAULT CHARACTER SET=latin1 COLLATE=latin1_swedish_ci
    AUTO_INCREMENT=0;
");