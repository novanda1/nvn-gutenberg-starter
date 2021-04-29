<?php

/**
 * Plugin Name: NVN Custom Block
 * Plugin URI: 
 * Description: Custom gutenberg blocks
 * Author: Novanda Ahsan
 * Author URI: 
 * Version: 1.0.0
 * License: MIT
 * 
 * 
 * inspired by
 * https://github.com/ahmadawais/create-guten-block/
 * 
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Block Initializer.
 */
require_once plugin_dir_path(__FILE__) . 'src/init.php';
