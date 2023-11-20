<?php

add_action('rest_api_init', 'register_human_ressources_route');

function register_human_ressources_route() {
register_rest_route('booking67/v1', '/human_ressources', array(
'methods' => WP_REST_Server::CREATABLE,
'callback' => 'add_human_ressource',
'permission_callback' => function() {
return current_user_can('manage_options');
},
));
}

function create_booking67_human_ressources_table() {
global $wpdb;
$table_name = $wpdb->prefix . 'booking67_human_ressources';

if($wpdb->get_var("SHOW TABLES LIKE '$table_name'") != $table_name) {
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
register_activation_hook(__FILE__, 'create_booking67_human_ressources_table');

function add_human_ressource(WP_REST_Request $request) {
global $wpdb;
$table_name = $wpdb->prefix . 'booking67_human_ressources';

$nom = sanitize_text_field($request->get_param('nom'));
$prenom = sanitize_text_field($request->get_param('prenom'));
$role = sanitize_text_field($request->get_param('role'));
$actif = $request->get_param('actif') ? 1 : 0;

if (!$nom || !$prenom || !$role) {
return new WP_Error('missing_parameter', 'Tous les champs sont requis.', array('status' => 400));
}

$wpdb->insert($table_name, array(
'nom' => $nom,
'prenom' => $prenom,
'role' => $role,
'actif' => $actif,
));

return new WP_REST_Response(array('message' => 'Utilisateur ajouté avec succès'), 200);
}
