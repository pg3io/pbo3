PBO3 (beta)
===

[![langage](https://img.shields.io/badge/Langage-vue.js-green.svg)](https://vuejs.org/)
[![pg3.io](https://img.shields.io/badge/made%20by-PG3-orange.svg)](https://twitter.com/pg3io/)
[![Apache 2.0 Licence](https://img.shields.io/hexpm/l/plug.svg)](LICENCE)

# Introduction
PBO3 est un outil d'inventaire de parc serveur, basé sur le Headless CMS [Strapi](https://github.com/strapi/strapi).

# Fonctions
* Listing (exemple):
  * Serveur (ns1.pg3.xyz,ns2.pg3.xyz, ...)
  * Hosteur/Datacenter (Scaleway DC5, OVH GRA1, ...)
  * OS (Debian Buster, Ubuntu 18.04, ...)
  * Clients (Sonos, Yubikey, ...)
  * Environnement (Production, Staging, ...)
  * Type (VM, Physique, ...)
  * Services (docker, nginx, mariadb, ...) 
* Champs de recherche multi-fonction
  * Recherche
  * Ajoute
  * Suppression
* Script d'export inventory Ansible

# Prérequis
* Strapi avec le schéma => [ici (wiki)](https://github.com/pg3io/pbo3/wiki/Strapi)
* Le module graphQL de Strapi

# Démarrage rapide
Déclarer l'url de votre API dans le docker-comose.yml => ``graphEndpoint``
```
docker-compose up 
```

# Contributeurs

* Vue.js
* Boostrapi-vue

# License
Ce projet est sous licence [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0) consulter le fichier [LICENSE](LICENSE) pour plus de détails.

# Informations sur l'auteur
Ce projet a été créé par [PG3](https://pg3.io) en septembre 2020. 
