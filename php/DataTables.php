<?php
function booking67_create_human_ressources_table()
{
global $wpdb;
$table_name = $wpdb->prefix . 'booking67_human_ressources';

if ($wpdb->get_var("SHOW TABLES LIKE '$table_name'") != $table_name) {
$charset_collate = $wpdb->get_charset_collate();
$sql = "CREATE TABLE $table_name (
id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
nom VARCHAR(255) NOT NULL,
prenom VARCHAR(255) NOT NULL,
role VARCHAR(255) NOT NULL,
actif BOOLEAN NOT NULL DEFAULT 1
) $charset_collate;";
require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
dbDelta($sql);
}
}
function booking67_create_practician_availability_table()
{
    global $wpdb;
    $table_name = $wpdb->prefix . 'booking67_practician_availability';

    // Vérifiez si la table existe déjà
    if ($wpdb->get_var("SHOW TABLES LIKE '$table_name'") != $table_name) {
        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE $table_name (
            id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            practician_id INT(11) UNSIGNED NOT NULL,
            day_name VARCHAR(50) NOT NULL,
            opening_time TIME NOT NULL,
            closing_time TIME NOT NULL
        ) $charset_collate;";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }
}
function booking67_create_options_table()
{
    global $wpdb;

    $charset_collate = $wpdb->get_charset_collate();
    $table_name = $wpdb->prefix . 'booking67_options';

    $sql = "CREATE TABLE $table_name (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        generic_type varchar(255) NOT NULL,
        value text NOT NULL,
        PRIMARY KEY  (id)
    ) $charset_collate;";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
}
function booking67_create_prestations_table()
{
    global $wpdb;

    $table_name = $wpdb->prefix . 'booking67_prestations';

    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE $table_name (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        practitioner_id mediumint(9) NOT NULL,
        prestation_name tinytext NOT NULL,
        prestation_cost float NOT NULL,
        prestation_duration time NOT NULL,
        PRIMARY KEY  (id)
    ) $charset_collate;";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
}
function booking67_create_rdv_table()
{
    global $wpdb;

    // Nom de la table
    $table_name = $wpdb->prefix . 'booking67_rdv';


    $charset_collate = $wpdb->get_charset_collate();

    // Création de la table si elle n'existe pas déjà
    $sql = "CREATE TABLE $table_name (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        practician_id integer NOT NULL,
        prestation_id integer NOT NULL,
        prestation_duration time NOT NULL,
        rdv_dateTime datetime NOT NULL,
        rdv_status integer NOT NULL,
        participants integer,
        observation text,
        user_mail varchar(255) DEFAULT NULL,
        user_id integer DEFAULT NULL,
        user_name varchar(255) DEFAULT NULL,
        user_firstName varchar(255) DEFAULT NULL,
        user_lastName varchar(255) DEFAULT NULL,
        user_phone varchar(20) DEFAULT NULL,
        PRIMARY KEY  (id)
    ) $charset_collate;";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);

    //insert_random_data_for_testing();

}