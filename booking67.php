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
        3
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
    echo '<div id="root" data-page="disponibilites"></div>';
}

// Fonction affichant le contenu de la page "Gestion du personnel"
function booking67_personnel_page()
{
    echo '<h1>Gestion du personnel</h1>';
    echo '<div id="root" data-page="personnel"></div>';
}

// Fonction pour charger l'application CRA (Create React App) dans l'administration
function load_cra_app($hook_suffix)
{
    if (is_admin()) {
        $plugin_pages = [
            'toplevel_page_booking67_options',
            'booking67_page_booking67-slug-disponibilites-submenu',
            'booking67_page_booking67-slug-personnel-submenu'
        ];

        // Si ce n'est pas une page du plugin, sortez
        if (!in_array($hook_suffix, $plugin_pages)) {
            return;
        }

        // Chemin vers les fichiers de l'application CRA
        $files = glob(__DIR__.'/components/build/static/js/main.*.js');
        $mainFile = !empty($files) ? basename($files[0]) : 'main.js';
        $script_path = plugins_url('components/build/static/js/'.$mainFile, __FILE__);
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

// Ajout de la route pour l'API REST
add_action('rest_api_init', function () {
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

// Route pour insérer une nouvelle disponibilité pour un praticien.
    register_rest_route('booker67/v1', '/availability', array(
        'methods' => 'POST',
        'callback' => 'insert_practician_availability',
        'permission_callback' => function () {
            return current_user_can('manage_options');  // Seulement les utilisateurs qui peuvent gérer les options
        }
    ));

// Route pour obtenir les disponibilités d'un praticien.
    register_rest_route('booker67/v1', '/availability', array(
        'methods' => 'GET',
        'callback' => 'get_practician_availabilities',
        'permission_callback' => '__return_true'
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

// Route pour récupérer toutes les options.
    register_rest_route('booker67/v1', '/options', array(
        'methods' => 'GET',
        'callback' => 'get_all_options'
    ));

// Route pour ajouter une nouvelle option.
    register_rest_route('booker67/v1', '/options', array(
        'methods' => 'POST',
        'callback' => 'add_options'
    ));

// Route pour mettre à jour une option en utilisant son ID.
    register_rest_route('booker67/v1', '/options/(?P<id>\d+)', array(
        'methods' => 'POST',
        'callback' => 'update_option_by_id'
    ));

// Route pour récupérer les options par type générique.
    register_rest_route('booker67/v1', '/options/generic_type/(?P<type>[a-zA-Z0-9-]+)', array(
        'methods' => 'GET',
        'callback' => 'get_options_by_generic_type'
    ));

// Route pour compter les options par type générique.
    register_rest_route('booker67/v1', '/options/generic_type_count/(?P<type>[a-zA-Z0-9-]+)', array(
        'methods' => 'GET',
        'callback' => 'count_options_by_generic_type'
    ));

});
/**
 * Récupère les ressources humaines actives.
 *
 * @param WP_REST_Request $request
 * @return array
 */
function get_human_ressources_actif(WP_REST_Request $request) {
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
function get_human_ressources_inactif(WP_REST_Request $request) {
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
function update_human_ressources_status(WP_REST_Request $request) {
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

/**
 * Insère une nouvelle disponibilité pour un praticien.
 *
 * @param WP_REST_Request $request
 * @return WP_REST_Response|WP_Error
 */
function insert_practician_availability(WP_REST_Request $request) {
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
function get_practician_availabilities(WP_REST_Request $request) {
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

/**
 * Met à jour une disponibilité existante d'un praticien.
 *
 * @param array $request
 * @return WP_REST_Response|WP_Error
 */
function handle_update_availability($request) {
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
function delete_availability($data) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'practician_availability';
    $id = $data['id'];

    $deleted = $wpdb->delete($table_name, array('id' => $id));

    if ($deleted === false) {
        return new WP_Error('could_not_delete', 'Could not delete the availability.', array('status' => 500));
    }

    return new WP_REST_Response(true, 200);
}

/**
 * Récupère toutes les options.
 *
 * @return array
 */
function get_all_options() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'booker67_options';
    $results = $wpdb->get_results("SELECT * FROM $table_name");
    return $results;
}

/**
 * Ajoute une nouvelle option.
 *
 * @param WP_REST_Request $request
 * @return WP_REST_Response
 */
function add_options(WP_REST_Request $request) {
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

/**
 * Met à jour une option existante.
 *
 * @param WP_REST_Request $request
 * @return WP_REST_Response
 */
function update_option_by_id(WP_REST_Request $request) {
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
function get_options_by_generic_type(WP_REST_Request $request) {
    // Accès global à l'objet de la base de données de WordPress
    global $wpdb;
    // Définir le nom de la table en utilisant le préfixe défini dans la configuration de WP
    $table_name = $wpdb->prefix . 'booker67_options';

    // Nettoyer le paramètre "type" pour éviter des problèmes de sécurité
    $type = sanitize_text_field($request->get_param('type'));

    // Récupérer toutes les lignes de la table qui correspondent au type générique donné
    $results = $wpdb->get_results($wpdb->prepare("SELECT * FROM $table_name WHERE generic_type = %s", $type));

    return $results;
}

/**
 * Compte le nombre d'options en fonction de leur type générique.
 *
 * @param WP_REST_Request $request La demande WP REST API.
 * @return array Un tableau associatif contenant le compte.
 */
function count_options_by_generic_type(WP_REST_Request $request) {
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

