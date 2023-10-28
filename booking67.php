<?php
/**
 * Plugin Name:       Booking67
 * Description:       booking plugin
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            M67
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       booking67
 *
 * @package           bookering
 */

add_action('admin_menu', 'my_custom_admin_menu');

function my_custom_admin_menu()
{
    add_menu_page(
        'paramètres généraux',          // Page title
        'Booking67',                    // Menu title
        'manage_options',               // Capability
        'booking67_options',            // Menu slug
        'booking67_admin_page',         // Callback function
        'dashicons-admin-generic',      // Icon URL (optional)
        3                               // Position (optional)
    );

    // Sous-menu 1
    add_submenu_page(
        'booking67_options',            // Slug du menu parent
        'Disponibilités',                  // Page title
        'Disponibilités',                  // Menu title
        'manage_options',               // Capability
        'booking67-slug-disponibilites-submenu',      // Menu slug
        'booking67_disponibilites_page'       // Callback function
    );

    // Sous-menu 2
    add_submenu_page(
        'booking67_options',            // Slug du menu parent
        'Personnel',                  // Page title
        'Personnel',                  // Menu title
        'manage_options',               // Capability
        'booking67-slug-personnel-submenu',      // Menu slug
        'booking67_personnel_page'       // Callback function
    );
}

function booking67_admin_page()
{
    echo '<div id="root" data-page="main"></div>';
//TODO: créer la page principal du plugin
}

function booking67_disponibilites_page()
{
    echo '<h1>Disponibilités du personnel</h1>';
    echo '<div id="root" data-page="disponibilites"></div>';
}

function booking67_personnel_page()
{
    echo '<h1>Gestion du personnel</h1>';
    echo '<div id="root" data-page="personnel"></div>';

}

function load_cra_app($hook_suffix)
{
    if (is_admin()) {   // Liste des pages de votre plugin
        $plugin_pages = [
            'toplevel_page_booking67_options',
            'booking67_page_booking67-slug-disponibilites-submenu',
            'booking67_page_booking67-slug-personnel-submenu'
        ];

        // Si ce n'est pas une page de votre plugin, sortez de la fonction
        if (!in_array($hook_suffix, $plugin_pages)) {
            return;
        }

        // Chemin vers les fichiers de l'application CRA
        $script_path = plugins_url('components/build/static/js/main.dedd2c91.js', __FILE__); // Modifiez le chemin en fonction de l'emplacement réel
        $style_path = plugins_url('components/build/static/css/main.073c9b0a.css', __FILE__);

        // Enregistrez et mettez en file d'attente les scripts et styles
        wp_enqueue_script('cra-app-js', $script_path, array(), null, true);
        wp_enqueue_style('cra-app-css', $style_path, array(), null);
        wp_localize_script('cra-app-js', 'wpApiSettings', array(
            'nonce' => wp_create_nonce('wp_rest')
        ));
    }
}

add_action('admin_enqueue_scripts', 'load_cra_app');


function create_booking67_human_ressources_table()
{
    global $wpdb;
    $table_name = $wpdb->prefix . 'booker67_human_ressource';

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

register_activation_hook(__FILE__, 'create_booking67_human_ressources_table');
function add_human_ressource(WP_REST_Request $request)
{
    global $wpdb;
    $table_name = $wpdb->prefix . 'booker67_human_ressources';

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

function create_practician_availability_table()
{
    global $wpdb;
    $table_name = $wpdb->prefix . 'practician_availability';

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

register_activation_hook(__FILE__, 'create_practician_availability_table');

function booker67_enqueue_public_scripts()
{
// Enqueue Bootstrap CSS
    wp_enqueue_style('bootstrap-css', 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css', array(), null);

    // Enqueue Bootstrap JavaScript
    wp_enqueue_script('bootstrap-js', 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.min.js', array('jquery'), null, true);
    wp_enqueue_script('jquery-ui-datepicker');
    wp_enqueue_script('jquery-ui-dialog');
    wp_enqueue_style('jquery-ui', 'https://code.jquery.com/ui/1.12.1/themes/smoothness/jquery-ui.css');
}
add_action('wp_enqueue_scripts', 'booker67_enqueue_public_scripts');


add_action('rest_api_init', function () {
    // Register all REST API routes here
    register_rest_route('booker67/v1', '/date_availability', array(
        'methods' => 'GET',
        'callback' => 'booker67_check_date_availability',
        'permission_callback' => '__return_true'
    ));


    register_rest_route('booker67/v1', '/human_ressources', array(
        'methods' => WP_REST_Server::CREATABLE,
        'callback' => 'add_human_ressource',
        'permission_callback' => '__return_true'
    ));
    register_rest_route('booker67/v1', '/human_ressources_actif', array(
        'methods' => 'GET',
        'callback' => 'get_human_ressources_actif',
        'permission_callback' => '__return_true'
    ));
    register_rest_route('booker67/v1', '/availability', array(
        'methods' => 'POST',
        'callback' => 'insert_practician_availability',
        'permission_callback' => function () {
            return current_user_can('manage_options');
        }
    ));

    register_rest_route('booker67/v1', '/availability', array(
        'methods' => 'GET',
        'callback' => 'get_practician_availabilities',
        'permission_callback' => '__return_true'
    ));
    register_rest_route('booker67/v1', '/availability/(?P<id>\d+)', array(
        'methods' => WP_REST_Server::EDITABLE,  // Cette constante permet à la fois les méthodes POST et PUT
        'callback' => 'handle_update_availability',
        'args' => array(
            'id' => array(
                'validate_callback' => function ($param, $request, $key) {
                    return is_numeric($param);
                }
            ),
            'practician_id' => array(
                'required' => true,
                'validate_callback' => function ($param, $request, $key) {
                    return is_numeric($param);
                }
            ),
            'day_name' => array(
                'required' => true,
                'sanitize_callback' => 'sanitize_text_field'
            ),
            'opening_time' => array(
                'required' => true,
                'sanitize_callback' => 'sanitize_text_field'
            ),
            'closing_time' => array(
                'required' => true,
                'sanitize_callback' => 'sanitize_text_field'
            ),
        ),
        'permission_callback' => function () {
            return current_user_can('edit_posts');
        },
    ));
    register_rest_route('booker67/v1', '/availability/(?P<id>\d+)', array(
        'methods' => 'DELETE',
        'callback' => 'delete_availability',
    ));
    register_rest_route('booker67/v1', '/slots', array(
        'methods' => 'DELETE',
        'callback' => 'booker67_remove_slot',
        'permission_callback' => function () {
            return current_user_can('edit_posts');
        }
    ));


});

function get_human_ressources_actif(WP_REST_Request $request)
{
    global $wpdb;
    $table_name = $wpdb->prefix . 'booker67_human_ressources';
    $results = $wpdb->get_results("SELECT id, nom, prenom, role FROM $table_name WHERE actif = 1", ARRAY_A);
    return $results;
}

function insert_practician_availability(WP_REST_Request $request)
{
    global $wpdb;
    $table_name = $wpdb->prefix . 'practician_availability';

    // Récupérer les données depuis la requête
    $practician_id = intval($request->get_param('practician_id'));
    $day_name = sanitize_text_field($request->get_param('day_name'));
    $opening_time = sanitize_text_field($request->get_param('opening_time'));
    $closing_time = sanitize_text_field($request->get_param('closing_time'));

    // Insérer les données dans la table
    $result = $wpdb->insert($table_name, array(
        'practician_id' => $practician_id,
        'day_name' => $day_name,
        'opening_time' => $opening_time,
        'closing_time' => $closing_time
    ));

    if ($result) {
        return new WP_REST_Response(array('message' => 'Disponibilité enregistrée avec succès'), 200);
    } else {
        return new WP_Error('db_insert_error', 'Erreur lors de l’enregistrement de la disponibilité.', array('status' => 500));
    }
}

function get_practician_availabilities(WP_REST_Request $request)
{
    global $wpdb;
    $table_name = $wpdb->prefix . 'practician_availability';

    // Récupérer l'ID du praticien depuis la requête
    $practician_id = $request->get_param('value');

    // Si un practician_id est fourni, récupérer uniquement les disponibilités pour cet ID
    if ($practician_id) {
        $availabilities = $wpdb->get_results($wpdb->prepare("SELECT * FROM $table_name WHERE practician_id = %d", $practician_id));
    } else {
        $availabilities = $wpdb->get_results("SELECT * FROM $table_name");
    }

    return $availabilities;
}

function handle_update_availability($request)
{
    global $wpdb;
    $table_name = $wpdb->prefix . 'practician_availability';

    $id = $request['id'];
    $practician_id = $request['practician_id'];
    $day_name = $request['day_name'];
    $opening_time = $request['opening_time'];
    $closing_time = $request['closing_time'];

    $data = array(
        'practician_id' => $practician_id,
        'day_name' => $day_name,
        'opening_time' => $opening_time,
        'closing_time' => $closing_time,
    );

    $where = array('id' => $id);

    $updated = $wpdb->update($table_name, $data, $where);

    if (false === $updated) {
        return new WP_Error('db_update_error', __('Could not update the availability.', 'mon-plugin'), array('status' => 500));
    }

    return rest_ensure_response(array(
        'success' => true,
        'message' => __('Availability updated successfully.', 'mon-plugin'),
    ));
}

function delete_availability($data)
{
    global $wpdb;
    $table_name = $wpdb->prefix . 'practician_availability';
    $id = $data['id'];

    $deleted = $wpdb->delete($table_name, array('id' => $id));

    if ($deleted === false) {
        return new WP_Error('could_not_delete', 'Could not delete the availability.', array('status' => 500));
    }

    return new WP_REST_Response(true, 200);
}
