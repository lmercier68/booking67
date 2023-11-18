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


// Ajout d'une action pour le menu d'administration
add_action('admin_menu', 'my_custom_admin_menu');

// Fonction pour créer le menu et les sous-menus dans l'admin
function my_custom_admin_menu()
{
    // Ajout du menu principal
    add_menu_page(
        'paramètres généraux',
        'Booking67',
        'manage_options',
        'booking67_options',
        'booking67_admin_page',
        'dashicons-admin-generic',
        4
    );

    // Ajout du premier sous-menu "Disponibilités"
    add_submenu_page(
        'booking67_options',
        'Disponibilités',
        'Disponibilités',
        'manage_options',
        'booking67-slug-disponibilites-submenu',
        'booking67_disponibilites_page'
    );

    // Ajout du second sous-menu "Personnel"
    add_submenu_page(
        'booking67_options',
        'Personnel',
        'Personnel',
        'manage_options',
        'booking67-slug-personnel-submenu',
        'booking67_personnel_page'
    );
    // Ajout du second sous-menu "Prestation"
    add_submenu_page(
        'booking67_options',
        'Prestations',
        'Prestations',
        'manage_options',
        'booking67-slug-prestations-submenu',
        'booking67_prestations_page'
    );

}

function booking67_prestations_page()
{
    echo '<h1>Gestion des prestations</h1>';
    echo '<div id="root-prestations" data-page="prestations"></div>';
}

// Fonction affichant le contenu de la page principale du plugin
function booking67_admin_page()
{
    echo '<div id="root" data-page="main"></div>';
    // TODO: créer la page principale du plugin
}

// Fonction affichant le contenu de la page "Disponibilités du personnel"
function booking67_disponibilites_page()
{
    echo '<h1>Disponibilités du personnel</h1>';
    echo '<div id="root-disponibilites" data-page="disponibilites"></div>';

}

// Fonction affichant le contenu de la page "Gestion du personnel"
function booking67_personnel_page()
{
    echo '<h1>Gestion du personnel</h1>';
    echo '<div id="root-personnel" data-page="personnel"></div>';
}

// Fonction pour charger l'application CRA (Create React App) dans l'administration
function load_cra_app($hook_suffix)
{
    if (is_admin()) {
        $plugin_pages = [
            'toplevel_page_booking67_options',
            'booking67_page_booking67-slug-disponibilites-submenu',
            'booking67_page_booking67-slug-personnel-submenu',
            'booking67_page_booking67-slug-prestations-submenu'
        ];

        // Si ce n'est pas une page du plugin, sortez
        if (!in_array($hook_suffix, $plugin_pages)) {
            return;
        }

        // Chemin vers les fichiers de l'application CRA
        $files = glob(__DIR__ . '/components/build/static/js/main.*.js');
        $mainFile = !empty($files) ? basename($files[0]) : 'main.js';
        $script_path = plugins_url('components/build/static/js/' . $mainFile, __FILE__);
        $style_path = plugins_url('components/build/static/css/main.073c9b0a.css', __FILE__);

        // Enregistrement et mise en file d'attente des scripts et styles
        wp_enqueue_script('cra-app-js', $script_path, array(), null, true);
        wp_enqueue_style('cra-app-css', $style_path, array(), null);
        wp_localize_script('cra-app-js', 'wpApiSettings', array(
            'nonce' => wp_create_nonce('wp_rest')
        ));
    }
}

// Action pour ajouter les scripts nécessaires
add_action('admin_enqueue_scripts', 'load_cra_app');


function booker67_enqueue_public_scripts()
{
// Enqueue Bootstrap CSS
    wp_enqueue_style('bootstrap-css', 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css', array(), null);

    // Enqueue Bootstrap JavaScript
    wp_enqueue_script('bootstrap-js', 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.min.js', array('jquery'), null, true);
    wp_enqueue_script('jquery-ui-datepicker');
    wp_enqueue_script('jquery-ui-dialog');
    wp_enqueue_style('jquery-ui', 'https://code.jquery.com/ui/1.12.1/themes/smoothness/jquery-ui.css');
    wp_enqueue_script(
        'mon-plugin-frontend',
        plugins_url('build/frontend.js', __FILE__),
        array('wp-element'),
        filemtime(plugin_dir_path(__FILE__) . 'build/frontend.js'),
        true
    );

}

add_action('wp_enqueue_scripts', 'booker67_enqueue_public_scripts');



//region database_table_creation
// Création de la table "booker67_human_ressource" lors de l'activation du plugin
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

function create_booker67_options_table()
{
    global $wpdb;

    $charset_collate = $wpdb->get_charset_collate();
    $table_name = $wpdb->prefix . 'booker67_options';

    $sql = "CREATE TABLE $table_name (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        generic_type varchar(255) NOT NULL,
        value text NOT NULL,
        PRIMARY KEY  (id)
    ) $charset_collate;";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
}

register_activation_hook(__FILE__, 'create_booker67_options_table');
function create_prestations_table()
{
    global $wpdb;

    $table_name = $wpdb->prefix . 'booker67_prestations';

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

register_activation_hook(__FILE__, 'create_prestations_table');

function create_rdv_table()
{
    global $wpdb;

    // Nom de la table
    $table_name = $wpdb->prefix . 'booker67_rdv';


    $charset_collate = $wpdb->get_charset_collate();

    // Création de la table si elle n'existe pas déjà
    $sql = "CREATE TABLE $table_name (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        practician_id integer NOT NULL,
        prestation_id integer NOT NULL,
        prestation_duration time NOT NULL,
        rdv_dateTime datetime NOT NULL,
        rdv_status integer NOT NULL,
        customer_id integer ,
        participants integer,
        observation text,
        PRIMARY KEY  (id)
    ) $charset_collate;";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);

    insert_random_data_for_testing();

}

register_activation_hook(__FILE__, 'create_rdv_table');


function insert_random_data_for_testing()
{
    global $wpdb;
    $table_name = $wpdb->prefix . 'booker67_rdv';

    // Génération de données aléatoires
    for ($i = 0; $i < 10; $i++) {
        $practician_id = rand(1, 4); // ID de practician entre 1 et 4
        $prestation_id = rand(1, 3); // ID de prestation entre 1 et 3
        $durations = ['15:00', '30:00', '45:00']; // Durées de prestation
        $prestation_duration = $durations[array_rand($durations)];
        $rdv_status = rand(1, 4); // Status du RDV entre 1 et 4

        // Générer une date aléatoire entre le 11/11/2023 et le 25/11/2023
        $start_date = strtotime('11-11-2023');
        $end_date = strtotime('25-11-2023');
        $random_date = mt_rand($start_date, $end_date);
        $rdv_dateTime = date('Y-m-d H:i:s', $random_date);

        // Insertion des données dans la base de données
        $wpdb->insert(
            $table_name,
            array(
                'practician_id' => $practician_id,
                'prestation_id' => $prestation_id,
                'prestation_duration' => $prestation_duration,
                'rdv_dateTime' => $rdv_dateTime,
                'rdv_status' => $rdv_status
            )
        );
    }
}

// Fonction pour ajouter une ressource humaine via l'API REST
function add_human_ressource(WP_REST_Request $request)
{
    global $wpdb;
    $table_name = $wpdb->prefix . 'booker67_human_ressources';

    // Récupération et assainissement des données
    $nom = sanitize_text_field($request->get_param('nom'));
    $prenom = sanitize_text_field($request->get_param('prenom'));
    $role = sanitize_text_field($request->get_param('role'));
    $actif = $request->get_param('actif') ? 1 : 0;

    if (!$nom || !$prenom || !$role) {
        return new WP_Error('missing_parameter', 'Tous les champs sont requis.', array('status' => 400));
    }

    // Insertion des données dans la base de données
    $wpdb->insert($table_name, array(
        'nom' => $nom,
        'prenom' => $prenom,
        'role' => $role,
        'actif' => $actif
    ));

    return new WP_REST_Response(array('success' => true, 'message' => 'Ressource ajoutée avec succès.'), 200);
}

//endregion
// Ajout de la route pour l'API REST
add_action('rest_api_init', function () {
//region human_ressources
    register_rest_route('booking67/v1', '/add-human-ressource', array(
        'methods' => WP_REST_Server::CREATABLE,
        'callback' => 'add_human_ressource',
        'permission_callback' => function () {
            return current_user_can('manage_options');
        }
    ));
// Enregistrement des routes et des endpoints pour l'API REST de WordPress.

// Route pour ajouter une nouvelle ressource humaine.
    register_rest_route('booker67/v1', '/human_ressources', array(
        'methods' => WP_REST_Server::CREATABLE,  // Correspond à la méthode POST
        'callback' => 'add_human_ressource',     // Fonction callback qui sera exécutée
        'permission_callback' => '__return_true' // Tout le monde a la permission
    ));

// Route pour récupérer les ressources humaines actives.
    register_rest_route('booker67/v1', '/human_ressources_actif', array(
        'methods' => 'GET',
        'callback' => 'get_human_ressources_actif',
        'permission_callback' => '__return_true'
    ));

// Route pour récupérer les ressources humaines inactives.
    register_rest_route('booker67/v1', '/human_ressources_inactif', array(
        'methods' => 'GET',
        'callback' => 'get_human_ressources_inactif',
        'permission_callback' => '__return_true'
    ));

// Route pour mettre à jour le statut d'une ressource humaine.
    register_rest_route('booker67/v1', '/update_human_ressources_status', array(
        'methods' => 'POST',
        'callback' => 'update_human_ressources_status'
    ));
    register_rest_route('booker67/v1', '/human-ressource/(?P<id>\d+)', array(
        'methods' => 'GET',
        'callback' => 'get_human_ressource_by_id',
        'permission_callback' => '__return_true' // Vous pouvez également définir une fonction de rappel de permission ici
    ));
//endregion
//region availability
// Route pour insérer une nouvelle disponibilité pour un praticien.
    register_rest_route('booker67/v1', '/availability', array(
        'methods' => 'POST',
        'callback' => 'insert_practician_availability',
        'permission_callback' => function () {
            return current_user_can('manage_options');  // Seulement les utilisateurs qui peuvent gérer les options
        }
    ));

// Route pour obtenir les disponibilités des praticien.
    register_rest_route('booker67/v1', '/availability', array(
        'methods' => 'GET',
        'callback' => 'get_practician_availabilities',
        'permission_callback' => '__return_true'
    ));
    register_rest_route('booker67/v1', '/availability/(?P<practician_id>\d+)', array(
        'methods' => 'GET',
        'callback' => 'get_practician_availability_by_practician',
    ));
// Route pour mettre à jour une disponibilité.
    register_rest_route('booker67/v1', '/availability/(?P<id>\d+)', array(
        'methods' => WP_REST_Server::EDITABLE,
        'callback' => 'handle_update_availability',
        'args' => array(
            // Liste des arguments attendus dans la requête
            'id' => array(
                'validate_callback' => function ($param, $request, $key) {
                    return is_numeric($param);  // L'id doit être numérique
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
                'sanitize_callback' => 'sanitize_text_field' // Nettoyage de la chaîne
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
            return current_user_can('edit_posts');  // Seulement les utilisateurs qui peuvent éditer les articles
        },
    ));

// Route pour supprimer une disponibilité.
    register_rest_route('booker67/v1', '/availability/(?P<id>\d+)', array(
        'methods' => 'DELETE',
        'callback' => 'delete_availability'
    ));
//endregion
//region options_route
    /* Route pour récupérer toutes les options.*/
    register_rest_route('booker67/v1', '/options', array(
        'methods' => 'GET',
        'callback' => 'get_all_options'
    ));
    register_rest_route('booker67/v1', '/options/filter', array(
        'methods' => 'GET',
        'callback' => 'get_filtered_options',
        'args' => array(
            'types' => array(
                'required' => false,
                'default' => array(),
                'sanitize_callback' => 'wp_parse_slug_list'
            )
        )
    ));

    /* Route pour ajouter une nouvelle option.*/
    register_rest_route('booker67/v1', '/options', array(
        'methods' => 'POST',
        'callback' => 'add_options'
    ));
    register_rest_route('booker67/v1', '/multiOptions', array(
        'methods' => 'POST',
        'callback' => 'add_multiOptions'
    ));
    /* Route pour mettre à jour une option en utilisant son ID.*/
    register_rest_route('booker67/v1', '/options/(?P<id>\d+)', array(
        'methods' => 'POST',
        'callback' => 'update_option_by_id'
    ));

    /* Route pour récupérer les options par type générique.*/
    register_rest_route('booker67/v1', '/options/generic_type/(?P<type>[a-zA-Z0-9-_]+)', array(
        'methods' => 'GET',
        'callback' => 'get_options_by_generic_type'
    ));

    /* Route pour compter les options par type générique.*/
    register_rest_route('booker67/v1', '/options/generic_type_count/(?P<type>[a-zA-Z0-9-_]+)', array(
        'methods' => 'GET',
        'callback' => 'count_options_by_generic_type'
    ));
//endregion
//region prestations_route
    register_rest_route('booker67/v1', '/prestations', array(
        'methods' => 'POST',
        'callback' => 'save_prestation',

    ));

    register_rest_route('booker67/v1', '/prestations', array(
        'methods' => 'GET',
        'callback' => 'get_prestations',

    ));

    register_rest_route('booker67/v1', '/prestations/practitioner_id/(?P<practitioner_id>\d+)', array(
        'methods' => 'GET',
        'callback' => 'get_prestations_by_practitioner_id',
    ));
    register_rest_route('booker67/v1', '/prestations/(?P<id>\d+)', array(
        'methods' => 'DELETE',
        'callback' => 'delete_prestation',

    ));
    register_rest_route('booker67/v1', '/prestations/(?P<id>\d+)', array(
        'methods' => 'PUT',
        'callback' => 'update_prestation',
        'args' => array(
            'id' => array(
                'required' => true,
                'validate_callback' => function ($param, $request, $key) {
                    return is_numeric($param);
                }
            ),
            'prestation_cost' => array(
                'required' => true,
                'validate_callback' => function ($param, $request, $key) {
                    return is_numeric($param);
                }
            ),
            'prestation_duration' => array(
                'required' => true,
                'validate_callback' => function ($param, $request, $key) {
                    return preg_match('/^\d{2}:\d{2}:\d{2}$/', $param);
                }
            ),
        ),
    ));
    register_rest_route('booker67/v1', '/prestation/(?P<id>\d+)', array(
        'methods' => 'GET',
        'callback' => 'get_prestation_by_id',
        'permission_callback' => '__return_true'
    ));
//endregion
//region appointement
    register_rest_route('booker67/v1', '/appointments/(?P<practician_id>\d+)', array(
        'methods' => 'GET',
        'callback' => 'get_practician_appointments',
    ));
    register_rest_route('booker67/v1', '/add-rdv/', array(
        'methods' => 'POST',
        'callback' => 'api_add_rdv',
    ));
//endregion
});

//region human_ressources_callback
/**
 * Récupère les ressources humaines actives.
 *
 * @param WP_REST_Request $request
 * @return array
 */
function get_human_ressources_actif(WP_REST_Request $request)
{
    global $wpdb;
    $table_name = $wpdb->prefix . 'booker67_human_ressources';
    $results = $wpdb->get_results("SELECT id, nom, prenom, role FROM $table_name WHERE actif = 1", ARRAY_A);
    return $results;
}

/**
 * Récupère les ressources humaines inactives.
 *
 * @param WP_REST_Request $request
 * @return array
 */
function get_human_ressources_inactif(WP_REST_Request $request)
{
    global $wpdb;
    $table_name = $wpdb->prefix . 'booker67_human_ressources';
    $results = $wpdb->get_results("SELECT id, nom, prenom, role FROM $table_name WHERE actif = 0", ARRAY_A);
    return $results;
}

/**
 * Met à jour le statut d'une ressource humaine.
 *
 * @param WP_REST_Request $request
 * @return WP_REST_Response
 */
function update_human_ressources_status(WP_REST_Request $request)
{
    $user_id = $request->get_param('id');
    $status = $request->get_param('actif'); // "actif" ou "inactif"

    global $wpdb;
    $table_name = $wpdb->prefix . 'booker67_human_ressources';
    $wpdb->update(
        $table_name,
        array('actif' => $status),
        array('id' => $user_id)
    );

    return new WP_REST_Response(array('status' => 'success'), 200);
}
function get_human_ressource_by_id($data) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'booker67_human_ressources';
    $id = $data['id'];

    $result = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_name WHERE id = %d", $id), ARRAY_A);

    if (is_null($result)) {
        return new WP_Error('no_human_ressource', 'Aucune ressource humaine trouvée avec cet ID', array('status' => 404));
    }

    return new WP_REST_Response($result, 200);
}
//endregion
//region pratician_availability_callback
/**
 * Insère une nouvelle disponibilité pour un praticien.
 *
 * @param WP_REST_Request $request
 * @return WP_REST_Response|WP_Error
 */
function insert_practician_availability(WP_REST_Request $request)
{
    global $wpdb;
    $table_name = $wpdb->prefix . 'practician_availability';

    $practician_id = intval($request->get_param('practician_id'));
    $day_name = sanitize_text_field($request->get_param('day_name'));
    $opening_time = sanitize_text_field($request->get_param('opening_time'));
    $closing_time = sanitize_text_field($request->get_param('closing_time'));

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

/**
 * Récupère les disponibilités d'un praticien spécifique ou de tous les praticiens.
 *
 * @param WP_REST_Request $request
 * @return array
 */
function get_practician_availabilities(WP_REST_Request $request)
{
    global $wpdb;
    $table_name = $wpdb->prefix . 'practician_availability';

    $practician_id = $request->get_param('value');

    if ($practician_id) {
        $availabilities = $wpdb->get_results($wpdb->prepare("SELECT * FROM $table_name WHERE practician_id = %d", $practician_id));
    } else {
        $availabilities = $wpdb->get_results("SELECT * FROM $table_name");
    }

    return $availabilities;
}

function get_practician_availability_by_practician($data)
{
    global $wpdb;
    $practician_id = $data['practician_id'];
    $table_name = $wpdb->prefix . 'practician_availability';

    $results = $wpdb->get_results($wpdb->prepare(
        "SELECT * FROM $table_name WHERE practician_id = %d",
        $practician_id
    ));

    if (empty($results)) {
        return new WP_Error('no_availability_found', 'Aucune disponibilité trouvée', array('status' => 404));
    }

    return $results;
}

/**
 * Met à jour une disponibilité existante d'un praticien.
 *
 * @param array $request
 * @return WP_REST_Response|WP_Error
 */
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

/**
 * Supprime une disponibilité d'un praticien.
 *
 * @param array $data
 * @return WP_REST_Response|WP_Error
 */
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

//endregion_callback
//region options_callback
/**
 * Récupère toutes les options.
 *
 * @return array
 */
function get_all_options()
{
    global $wpdb;
    $table_name = $wpdb->prefix . 'booker67_options';
    $results = $wpdb->get_results("SELECT * FROM $table_name");
    return $results;
}
function get_filtered_options(WP_REST_Request $request)
{
    global $wpdb;
    $table_name = $wpdb->prefix . 'booker67_options';

    // Récupérer les types des paramètres de la requête
    $types = $request->get_param('types');

    // Construire la requête SQL
    $sql = "SELECT * FROM $table_name";
    if (!empty($types)) {
        $placeholders = array_fill(0, count($types), '%s');
        $placeholders = implode(',', $placeholders);
        $sql .= $wpdb->prepare(" WHERE generic_type IN ($placeholders)", $types);
    }

    // Exécuter la requête
    $results = $wpdb->get_results($sql);

    // Retourner les résultats
    return new WP_REST_Response($results, 200);
}
/**
 * Ajoute une nouvelle option.
 *
 * @param WP_REST_Request $request
 * @return WP_REST_Response
 */
function add_options(WP_REST_Request $request)
{
    global $wpdb;
    $table_name = $wpdb->prefix . 'booker67_options';

    $generic_type = sanitize_text_field($request->get_param('generic_type'));
    $value = sanitize_text_field($request->get_param('value'));

    $wpdb->insert($table_name, array(
        'generic_type' => $generic_type,
        'value' => $value,
    ));

    return new WP_REST_Response(array('message' => 'Option ajoutée avec succès'), 200);
}
function add_multiOptions($request) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'booker67_options';

    $data = $request->get_json_params();
    foreach ($data as $key => $value) {
        // Ajouter le préfixe "genType_" à chaque clé
        $option_name = 'genType_' . $key;

        // Vérifier si l'option existe déjà
        $existing = $wpdb->get_var($wpdb->prepare("SELECT id FROM $table_name WHERE generic_type = %s", $option_name));

        // Préparer les données pour l'insertion ou la mise à jour
        $option_data = array('generic_type' => $option_name, 'value' => maybe_serialize($value));
        $format = array('%s', '%s');

        if ($existing) {
            // Mettre à jour l'option existante
            $wpdb->update($table_name, $option_data, array('id' => $existing), $format, array('%d'));
        } else {
            // Insérer une nouvelle option
            $wpdb->insert($table_name, $option_data, $format);
        }
    }

    return new WP_REST_Response('Options enregistrées avec succès', 200);
}

/**
 * Met à jour une option existante.
 *
 * @param WP_REST_Request $request
 * @return WP_REST_Response
 */
function update_option_by_id(WP_REST_Request $request)
{
    global $wpdb;
    $table_name = $wpdb->prefix . 'booker67_options';

    $id = $request->get_param('id');
    $generic_type = sanitize_text_field($request->get_param('generic_type'));
    $value = sanitize_text_field($request->get_param('value'));

    $wpdb->update(
        $table_name,
        array(
            'generic_type' => $generic_type,
            'value' => $value
        ),
        array('id' => $id)
    );

    return new WP_REST_Response(array('message' => 'Option mise à jour avec succès'), 200);
}

/**
 * Récupère les options en fonction de leur type générique.
 *
 * @param WP_REST_Request $request La demande WP REST API.
 * @return array Les résultats de la requête.
 */
function get_options_by_generic_type(WP_REST_Request $request)
{
    // Accès global à l'objet de la base de données de WordPress
    global $wpdb;
    // Définir le nom de la table en utilisant le préfixe défini dans la configuration de WP
    $table_name = $wpdb->prefix . 'booker67_options';
    // Nettoyer le paramètre "type" pour éviter des problèmes de sécurité
    $type = sanitize_text_field($request->get_param('type'));

    // Récupérer toutes les lignes de la table qui correspondent au type générique donné
    $results = $wpdb->get_results($wpdb->prepare("SELECT * FROM $table_name WHERE generic_type = %s", $type));

    // Vérifier si des résultats ont été trouvés
    if (empty($results)) {
        return new WP_Error('no_options', 'Aucune option trouvée', array('status' => 404));
    }

    // Retourner une réponse REST API avec les résultats
    return new WP_REST_Response($results, 200);
}

/**
 * Compte le nombre d'options en fonction de leur type générique.
 *
 * @param WP_REST_Request $request La demande WP REST API.
 * @return array Un tableau associatif contenant le compte.
 */
function count_options_by_generic_type(WP_REST_Request $request)
{
    // Accès global à l'objet de la base de données de WordPress
    global $wpdb;
    // Définir le nom de la table en utilisant le préfixe défini dans la configuration de WP
    $table_name = $wpdb->prefix . 'booker67_options';

    // Nettoyer le paramètre "type" pour éviter des problèmes de sécurité
    $type = sanitize_text_field($request->get_param('type'));

    // Récupérer le nombre d'options qui correspondent au type générique donné
    $count = $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM $table_name WHERE generic_type = %s", $type));

    // Retourner le compte sous forme de tableau associatif
    return array('count' => intval($count));
}

//endregion
//region prestation_callback
function save_prestation($data)
{
    global $wpdb;

    // Récupération des paramètres de la requête
    $practician_id = $data['practitioner_id'];
    $prestation_name = $data['prestation_name'];
    $prestation_cost = $data['prestation_cost'];
    $prestation_duration = $data['prestation_duration'];

    // Insertion de la prestation dans la table
    $result = $wpdb->insert(
        $wpdb->prefix . 'booker67_prestations',
        array(
            'practitioner_id' => $practician_id,
            'prestation_name' => $prestation_name,
            'prestation_cost' => $prestation_cost,
            'prestation_duration' => $prestation_duration,
        ),
        array('%d', '%s', '%f', '%s')
    );

    // Vérification du résultat de l'insertion
    if ($result === false) {
        return new WP_Error('db_error', 'Erreur lors de l\'insertion en base de données', array('status' => 500));
    }

    // Retour du résultat
    return new WP_REST_Response('Prestation sauvegardée avec succès', 200);
}


function get_prestations(WP_REST_Request $request)
{
    global $wpdb;
    $table_name = $wpdb->prefix . 'booker67_prestations';

    // Nettoyer le paramètre "practitioner_id" pour éviter des problèmes de sécurité


    // Récupérer toutes les lignes de la table qui correspondent au practitioner_id donné
    $results = $wpdb->get_results($wpdb->prepare("SELECT * FROM $table_name"));

    // Vérifier si des résultats ont été trouvés
    if (empty($results)) {
        // Retourner une réponse REST API avec un tableau vide et un statut de 200
        return new WP_REST_Response([], 200);
    }

    // Retourner une réponse REST API avec les résultats
    return new WP_REST_Response($results, 200);
}

function get_prestations_by_practitioner_id(WP_REST_Request $request)
{
    global $wpdb;
    $table_name = $wpdb->prefix . 'booker67_prestations';

    // Nettoyer le paramètre "practitioner_id" pour éviter des problèmes de sécurité
    $practitioner_id = sanitize_text_field($request->get_param('practitioner_id'));

    // Récupérer toutes les lignes de la table qui correspondent au practitioner_id donné
    $results = $wpdb->get_results($wpdb->prepare("SELECT * FROM $table_name WHERE practitioner_id = %d", $practitioner_id));

    // Vérifier si des résultats ont été trouvés
    if (empty($results)) {
        // Retourner une réponse REST API avec un tableau vide et un statut de 200
        return new WP_REST_Response([], 200);
    }

    // Retourner une réponse REST API avec les résultats
    return new WP_REST_Response($results, 200);
}

function delete_prestation($data)
{
    global $wpdb;

    $table_name = $wpdb->prefix . 'booker67_prestations';
    $prestation_id = $data['id'];

    $result = $wpdb->delete($table_name, array('id' => $prestation_id));

    if ($result === false) {
        return new WP_Error('prestation_delete_failed', 'La suppression de la prestation a échoué', array('status' => 500));
    }

    return new WP_REST_Response('Prestation supprimée avec succès', 200);
}

function update_prestation($data)
{
    global $wpdb;
    $table_name = $wpdb->prefix . 'booker67_prestations';

    $prestation_id = $data['id'];
    $prestation_cost = $data['prestation_cost'];
    $prestation_duration = $data['prestation_duration'];

    $result = $wpdb->update(
        $table_name,
        array(
            'prestation_cost' => $prestation_cost,
            'prestation_duration' => $prestation_duration,
        ),
        array('id' => $prestation_id)
    );

    if (false === $result) {
        return new WP_Error('prestation_update_failed', 'Failed to update prestation', array('status' => 500));
    }

    $prestation = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_name WHERE id = %d", $prestation_id), ARRAY_A);

    return new WP_REST_Response($prestation, 200);
}
function get_prestation_by_id($data) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'booker67_prestations';
    $id = $data['id'];

    $prestation = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_name WHERE id = %d", $id), ARRAY_A);

    if (is_null($prestation)) {
        return new WP_Error('no_prestation', 'Aucune prestation trouvée avec cet ID', array('status' => 404));
    }

    return new WP_REST_Response($prestation, 200);
}
//endregion

function get_practician_appointments($data)
{
    global $wpdb;
    $practician_id = $data['practician_id'];
    $table_name = $wpdb->prefix . 'booker67_rdv';

    // Récupération des enregistrements de la base de données
    $appointments = $wpdb->get_results(
        $wpdb->prepare("SELECT * FROM $table_name WHERE practician_id = %d", $practician_id)
    );

    // Retourner les enregistrements au format JSON
    return new WP_REST_Response($appointments, 200);
}
function api_add_rdv($request) {
    global $wpdb; // Accès global à l'objet $wpdb

    // Récupération des paramètres de la requête
    $params = $request->get_json_params();
    $practician_id = $params['practician_id'];
    $prestation_id = $params['prestation_id'];
    $prestation_duration = $params['prestation_duration'];
    $rdv_dateTime = $params['rdv_dateTime'];
    $rdv_status = $params['rdv_status'];
    $customer_id = $params['customer_id'];
    $participants = $params['participants'];
    // Nom de la table
    $table_name = $wpdb->prefix . 'booker67_rdv';

    // Insertion dans la base de données
    $result = $wpdb->insert(
        $table_name,
        array(
            'practician_id' => $practician_id,
            'prestation_id' => $prestation_id,
            'prestation_duration' => $prestation_duration,
            'rdv_dateTime' => $rdv_dateTime,
            'rdv_status' => $rdv_status,
            'customer_id' => $customer_id,
            'participants' => $participants
        ),
        array('%d', '%d', '%s', '%s', '%d', '%d')
    );

    // Vérification du résultat de l'insertion
    if ($result) {
        return new WP_REST_Response('Rendez-vous ajouté avec succès', 200);
    } else {
        return new WP_REST_Response('Erreur lors de l\'ajout du rendez-vous', 500);
    }
}
function mon_plugin_enqueue_scripts()
{
    // Enregistre nos scripts React (ne les met pas encore en file d'attente)
    wp_register_script('mon-plugin-frontend-js', plugins_url('/build/frontend.js', __FILE__), ['wp-element'], time(), true);
    wp_register_style('mon-plugin-frontend-css', plugins_url('/build/frontend.css', __FILE__));  // Optionnel
}

add_action('wp_enqueue_scripts', 'mon_plugin_enqueue_scripts');

function booking67_frontend_shortcode()
{
    // Enqueue React scripts and styles
    wp_enqueue_script('mon-plugin-frontend-js');  // Handle que vous avez défini lors de l'enregistrement du script
    wp_enqueue_style('mon-plugin-frontend-css');  // Optionnel: Si vous avez des styles spécifiques pour le frontend

    return '<div id="booking67-root"></div>';  // Cette div sera notre point d'ancrage pour React
}

add_shortcode('booking67_frontend', 'booking67_frontend_shortcode');