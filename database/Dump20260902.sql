-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: hotel_carbon_footprint
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activities`
--

DROP TABLE IF EXISTS `activities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activities` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int unsigned NOT NULL,
  `scope_id` tinyint unsigned NOT NULL,
  `category_id` int unsigned NOT NULL,
  `activity_type_id` int unsigned NOT NULL,
  `material_id` int unsigned DEFAULT NULL,
  `supplier_id` int unsigned DEFAULT NULL,
  `activity_date` date NOT NULL,
  `quantity` decimal(20,6) NOT NULL,
  `unit` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `data_source` enum('INVOICE','METER','RECEIPT','SUPPLIER','ESTIMATE','OTHER') COLLATE utf8mb4_unicode_ci DEFAULT 'OTHER',
  `status` enum('DRAFT','SUBMITTED','APPROVED','REJECTED') COLLATE utf8mb4_unicode_ci DEFAULT 'DRAFT',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_activities_date` (`activity_date`),
  KEY `idx_activities_scope` (`scope_id`),
  KEY `idx_activities_status` (`status`),
  KEY `fk_activity_user` (`user_id`),
  KEY `fk_activity_category` (`category_id`),
  KEY `fk_activity_type` (`activity_type_id`),
  KEY `fk_activity_material` (`material_id`),
  KEY `fk_activity_supplier` (`supplier_id`),
  CONSTRAINT `fk_activity_category` FOREIGN KEY (`category_id`) REFERENCES `scope_categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_activity_material` FOREIGN KEY (`material_id`) REFERENCES `materials` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_activity_scope` FOREIGN KEY (`scope_id`) REFERENCES `scopes` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_activity_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_activity_type` FOREIGN KEY (`activity_type_id`) REFERENCES `activity_types` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_activity_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activities`
--

LOCK TABLES `activities` WRITE;
/*!40000 ALTER TABLE `activities` DISABLE KEYS */;
INSERT INTO `activities` VALUES (1,'',1,1,1,1,20,NULL,'2026-08-25',100.000000,'kg','แก้ไขข้อมูลทดสอบ','OTHER','DRAFT','2026-08-10 12:18:46','2026-08-24 20:30:05'),(4,'',1,3,9,6,56,NULL,'2026-08-10',100.000000,'kg',NULL,'OTHER','DRAFT','2026-08-10 20:38:09','2026-08-10 20:38:09'),(5,'',1,3,9,6,18,NULL,'2026-08-10',50.000000,'kg',NULL,'OTHER','DRAFT','2026-08-10 21:10:10','2026-08-10 21:10:10'),(6,'จัดซื้อลิ้นจี่',4,3,9,6,63,NULL,'2026-09-01',670.000000,'kg',NULL,'OTHER','DRAFT','2026-09-01 14:50:16','2026-09-01 14:50:16');
/*!40000 ALTER TABLE `activities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activity_details`
--

DROP TABLE IF EXISTS `activity_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_details` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `activity_id` bigint unsigned NOT NULL,
  `field_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `field_value` text COLLATE utf8mb4_unicode_ci,
  `field_unit` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_activity_details_activity` (`activity_id`),
  CONSTRAINT `fk_activity_detail_activity` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_details`
--

LOCK TABLES `activity_details` WRITE;
/*!40000 ALTER TABLE `activity_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `activity_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activity_types`
--

DROP TABLE IF EXISTS `activity_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_types` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `category_id` int unsigned NOT NULL,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `default_unit` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `calculation_method` enum('ACTIVITY_BASED','MASS_BASED','ENERGY_BASED','DISTANCE_BASED','SPEND_BASED','OTHER') COLLATE utf8mb4_unicode_ci DEFAULT 'ACTIVITY_BASED',
  `description` text COLLATE utf8mb4_unicode_ci,
  `status` enum('ACTIVE','INACTIVE') COLLATE utf8mb4_unicode_ci DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_activity_type` (`category_id`,`code`),
  CONSTRAINT `fk_activity_type_category` FOREIGN KEY (`category_id`) REFERENCES `scope_categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_types`
--

LOCK TABLES `activity_types` WRITE;
/*!40000 ALTER TABLE `activity_types` DISABLE KEYS */;
INSERT INTO `activity_types` VALUES (1,1,'LPG','LPG','kg','ACTIVITY_BASED',NULL,'ACTIVE','2026-08-09 17:24:53','2026-08-09 17:24:53'),(2,1,'NATURAL_GAS','Natural Gas','MJ','ENERGY_BASED',NULL,'ACTIVE','2026-08-09 17:24:53','2026-08-09 17:24:53'),(3,1,'DIESEL','Diesel','Liter','ACTIVITY_BASED',NULL,'ACTIVE','2026-08-09 17:24:53','2026-08-09 17:24:53'),(4,1,'GASOLINE','Gasoline','Liter','ACTIVITY_BASED',NULL,'ACTIVE','2026-08-09 17:24:53','2026-08-09 17:24:53'),(5,5,'ELECTRICITY','Purchased Electricity','kWh','ENERGY_BASED',NULL,'ACTIVE','2026-08-09 17:24:53','2026-08-09 17:24:53'),(6,9,'PURCHASED_GOODS','Purchased Goods','kg','MASS_BASED',NULL,'ACTIVE','2026-08-09 17:24:53','2026-08-09 17:24:53'),(7,12,'TRANSPORTATION','Upstream Transportation','ton-km','DISTANCE_BASED',NULL,'ACTIVE','2026-08-09 17:24:53','2026-08-09 17:24:53'),(8,13,'FOOD_WASTE','Food Waste','kg','MASS_BASED',NULL,'ACTIVE','2026-08-09 17:24:53','2026-08-09 17:24:53');
/*!40000 ALTER TABLE `activity_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carbon_calculations`
--

DROP TABLE IF EXISTS `carbon_calculations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carbon_calculations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `activity_id` bigint unsigned NOT NULL,
  `emission_factor_id` bigint unsigned NOT NULL,
  `quantity` decimal(20,6) NOT NULL,
  `factor_value` decimal(20,12) NOT NULL,
  `co2_result` decimal(20,12) DEFAULT NULL,
  `ch4_result` decimal(20,12) DEFAULT NULL,
  `n2o_result` decimal(20,12) DEFAULT NULL,
  `total_co2e` decimal(20,12) NOT NULL,
  `calculation_type` enum('EMISSION','REMOVAL') COLLATE utf8mb4_unicode_ci DEFAULT 'EMISSION',
  `calculation_method` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `calculated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_calculation_activity` (`activity_id`),
  KEY `idx_calculation_ef` (`emission_factor_id`),
  CONSTRAINT `fk_calculation_activity` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_calculation_ef` FOREIGN KEY (`emission_factor_id`) REFERENCES `emission_factors` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carbon_calculations`
--

LOCK TABLES `carbon_calculations` WRITE;
/*!40000 ALTER TABLE `carbon_calculations` DISABLE KEYS */;
INSERT INTO `carbon_calculations` VALUES (1,1,20,100.000000,0.478300000000,0.000000000000,0.000000000000,0.000000000000,47.830000000000,'EMISSION','ACTIVITY_BASED','2026-08-10 12:20:30'),(3,4,87,100.000000,0.611600000000,0.000000000000,0.000000000000,0.000000000000,61.160000000000,'EMISSION','ACTIVITY_BASED','2026-08-10 20:38:09'),(4,5,18,50.000000,0.318800000000,0.000000000000,0.000000000000,0.000000000000,15.940000000000,'EMISSION','ACTIVITY_BASED','2026-08-10 21:10:10'),(5,6,94,670.000000,1.164900000000,0.000000000000,0.000000000000,0.000000000000,780.483000000000,'EMISSION','ACTIVITY_BASED','2026-09-01 14:50:16');
/*!40000 ALTER TABLE `carbon_calculations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `emission_factor_sources`
--

DROP TABLE IF EXISTS `emission_factor_sources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `emission_factor_sources` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `organization` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `url` text COLLATE utf8mb4_unicode_ci,
  `reference_document` text COLLATE utf8mb4_unicode_ci,
  `reference_date` date DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emission_factor_sources`
--

LOCK TABLES `emission_factor_sources` WRITE;
/*!40000 ALTER TABLE `emission_factor_sources` DISABLE KEYS */;
INSERT INTO `emission_factor_sources` VALUES (1,'TGO','Thailand Greenhouse Gas Management Organization','https://thaicarbonlabel.tgo.or.th/','Emission Factor CFO','2026-02-04','แหล่งอ้างอิงหลักของค่า Emission Factor สำหรับระบบ','2026-08-09 17:24:53','2026-08-09 17:24:53'),(2,'Thai National LCI Database','TIIS-MTEC-NSTDA','https://thaicarbonlabel.tgo.or.th/','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024)','2026-04-01','Emission factors for food and agricultural products from Thai National LCI Database, TIIS-MTEC-NSTDA, with TGO electricity 2022-2024. Update_April2026.','2026-08-10 10:41:36','2026-08-10 10:41:36');
/*!40000 ALTER TABLE `emission_factor_sources` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `emission_factor_versions`
--

DROP TABLE IF EXISTS `emission_factor_versions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `emission_factor_versions` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `source_id` int unsigned NOT NULL,
  `version_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `version_code` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `publication_date` date DEFAULT NULL,
  `effective_date` date DEFAULT NULL,
  `document_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `document_url` text COLLATE utf8mb4_unicode_ci,
  `description` text COLLATE utf8mb4_unicode_ci,
  `status` enum('DRAFT','ACTIVE','INACTIVE') COLLATE utf8mb4_unicode_ci DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_ef_version` (`source_id`,`version_code`),
  CONSTRAINT `fk_ef_version_source` FOREIGN KEY (`source_id`) REFERENCES `emission_factor_sources` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emission_factor_versions`
--

LOCK TABLES `emission_factor_versions` WRITE;
/*!40000 ALTER TABLE `emission_factor_versions` DISABLE KEYS */;
INSERT INTO `emission_factor_versions` VALUES (1,1,'EF CFO (AR5)_Feb 2026','TGO-CFO-AR5-FEB-2026','2026-02-04','2026-02-04','EF CFO (AR5)_Feb 2026',NULL,'TGO Emission Factor CFO ตามเอกสารเผยแพร่เดือนกุมภาพันธ์ 2026','ACTIVE','2026-08-09 17:24:53','2026-08-09 17:24:53'),(2,2,'Update_April2026','TNL-LCI-APR-2026','2026-04-01','2026-04-01','Thai National LCI Database - Update April 2026','https://thaicarbonlabel.tgo.or.th/','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024), updated April 2026.','ACTIVE','2026-08-10 10:43:05','2026-08-10 10:43:05'),(3,1,'TGO CFP Product-specific 2026','TGO-CFP-FY26','2026-04-01','2026-04-01','TGO Carbon Footprint of Product (CFP) 2026','https://thaicarbonlabel.tgo.or.th/','Product-specific Carbon Footprint of Product (CFP) values certified by TGO for products in fiscal year 2026.','ACTIVE','2026-08-10 11:47:48','2026-08-10 11:47:48');
/*!40000 ALTER TABLE `emission_factor_versions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `emission_factors`
--

DROP TABLE IF EXISTS `emission_factors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `emission_factors` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `source_id` int unsigned NOT NULL,
  `version_id` int unsigned NOT NULL,
  `scope_id` tinyint unsigned DEFAULT NULL,
  `category_id` int unsigned DEFAULT NULL,
  `activity_type_id` int unsigned DEFAULT NULL,
  `material_id` int unsigned DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `unit` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `co2_factor` decimal(20,12) DEFAULT NULL,
  `ch4_factor` decimal(20,12) DEFAULT NULL,
  `n2o_factor` decimal(20,12) DEFAULT NULL,
  `total_co2e_factor` decimal(20,12) NOT NULL,
  `emission_type` enum('FOSSIL','BIOGENIC','REMOVAL','OTHER') COLLATE utf8mb4_unicode_ci DEFAULT 'FOSSIL',
  `reference` text COLLATE utf8mb4_unicode_ci,
  `reference_year` year DEFAULT NULL,
  `valid_from` date DEFAULT NULL,
  `valid_to` date DEFAULT NULL,
  `priority` int DEFAULT '1',
  `status` enum('ACTIVE','INACTIVE') COLLATE utf8mb4_unicode_ci DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_ef_scope` (`scope_id`),
  KEY `idx_ef_category` (`category_id`),
  KEY `idx_ef_activity_type` (`activity_type_id`),
  KEY `idx_ef_material` (`material_id`),
  KEY `idx_ef_version` (`version_id`),
  KEY `fk_ef_source` (`source_id`),
  CONSTRAINT `fk_ef_activity_type` FOREIGN KEY (`activity_type_id`) REFERENCES `activity_types` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_ef_category` FOREIGN KEY (`category_id`) REFERENCES `scope_categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_ef_material` FOREIGN KEY (`material_id`) REFERENCES `materials` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_ef_scope` FOREIGN KEY (`scope_id`) REFERENCES `scopes` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_ef_source` FOREIGN KEY (`source_id`) REFERENCES `emission_factor_sources` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_ef_version` FOREIGN KEY (`version_id`) REFERENCES `emission_factor_versions` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=98 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emission_factors`
--

LOCK TABLES `emission_factors` WRITE;
/*!40000 ALTER TABLE `emission_factors` DISABLE KEYS */;
INSERT INTO `emission_factors` VALUES (1,1,1,1,1,1,NULL,'LPG','kg',3.110596296296,0.000049296296,0.000004929630,3.113282944444,'FOSSIL','TGO Emission Factor CFO; IPCC defaults (2006), Volume 2, Chapter 2, Table 2.3; fuel characteristics/conversion reference as listed by TGO.',2026,NULL,NULL,1,'ACTIVE','2026-08-09 17:24:54','2026-08-09 17:24:54'),(2,1,1,1,1,2,NULL,'Natural Gas','MJ',0.056100000000,0.000001000000,0.000000100000,0.056154500000,'FOSSIL','TGO Emission Factor CFO; EF CFO (AR5)_Feb 2026; IPCC defaults (2006), Volume 2, Chapter 2; fuel characteristics/conversion reference as listed by TGO.',2026,'2026-02-04',NULL,1,'ACTIVE','2026-08-10 09:39:34','2026-08-10 09:39:34'),(3,1,1,1,1,3,NULL,'Diesel','Liter',2.698722000000,0.000109260000,0.000021852000,2.707572060000,'FOSSIL','TGO Emission Factor CFO; EF CFO (AR5)_Feb 2026; IPCC defaults (2006), Volume 2, Chapter 2; fuel characteristics/conversion reference as listed by TGO.',2026,'2026-02-04',NULL,1,'ACTIVE','2026-08-10 09:39:34','2026-08-10 09:39:34'),(4,1,1,1,1,4,NULL,'Gasoline','Liter',2.181564000000,0.000094440000,0.000018888000,2.189213640000,'FOSSIL','TGO Emission Factor CFO; EF CFO (AR5)_Feb 2026; IPCC defaults (2006), Volume 2, Chapter 2; fuel characteristics/conversion reference as listed by TGO.',2026,'2026-02-04',NULL,1,'ACTIVE','2026-08-10 09:39:34','2026-08-10 09:39:34'),(5,1,1,2,5,5,NULL,'Purchased Electricity - Grid Mix 2022-2024','kWh',NULL,NULL,NULL,0.475000000000,'OTHER','TGO Emission Factor CFO; Grid Mix 2022-2024; CFO Scope 2; Thai National LCI Database, TIISMTEC-NSTDA, AR5 (with TGO electricity 2022-2024).',2026,'2026-02-04',NULL,1,'ACTIVE','2026-08-10 09:56:13','2026-08-10 09:56:13'),(6,2,2,3,9,6,11,'เป็ดเนื้อ','kg',NULL,NULL,NULL,4.758500000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024), Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 11:19:19','2026-08-10 11:19:19'),(7,2,2,3,9,6,6,'ไข่ไก่','kg',NULL,NULL,NULL,8.849700000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024), Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 11:27:46','2026-08-10 11:27:46'),(8,2,2,3,9,6,7,'ไก่สดทั้งตัว','kg',NULL,NULL,NULL,4.420100000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024), Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 11:27:46','2026-08-10 11:27:46'),(9,2,2,3,9,6,8,'ไก่สดชำแหละ','kg',NULL,NULL,NULL,4.498800000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024), Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 11:27:46','2026-08-10 11:27:46'),(10,2,2,3,9,6,9,'สุกรขุนชำแหละ','kg',NULL,NULL,NULL,4.204500000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024), Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 11:27:46','2026-08-10 11:27:46'),(11,2,2,3,9,6,10,'เนื้อโคชำแหละ','kg',NULL,NULL,NULL,13.820600000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024), Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 11:27:46','2026-08-10 11:27:46'),(12,2,2,3,9,6,12,'ปลาดุก','kg',NULL,NULL,NULL,3.777600000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024), Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 11:27:46','2026-08-10 11:27:46'),(13,2,2,3,9,6,13,'ปลาทับทิม','kg',NULL,NULL,NULL,0.431800000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024), Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 11:27:46','2026-08-10 11:27:46'),(14,1,3,3,9,6,14,'ข้าว กข43','kg',NULL,NULL,NULL,2.030000000000,'OTHER','TGO CFP FY26-461-3653; Product-specific',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 11:44:26','2026-08-10 11:49:35'),(15,1,3,3,9,6,15,'ข้าวหอมมะลิ','kg',NULL,NULL,NULL,3.710000000000,'OTHER','TGO CFP FY26-434-3382; Product-specific',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 11:44:26','2026-08-10 11:49:35'),(16,2,2,3,9,6,16,'กะหล่ำปลี','kg',NULL,NULL,NULL,0.342500000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 11:58:30','2026-08-10 11:58:30'),(17,2,2,3,9,6,17,'ข้าวโพดฝักอ่อน','kg',NULL,NULL,NULL,0.421000000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 11:58:30','2026-08-10 11:58:30'),(18,2,2,3,9,6,18,'หอมหัวใหญ่','kg',NULL,NULL,NULL,0.318800000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 11:58:30','2026-08-10 11:58:30'),(19,2,2,3,9,6,19,'หอมแดง','kg',NULL,NULL,NULL,0.390700000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 11:58:30','2026-08-10 11:58:30'),(20,2,2,3,9,6,20,'กระเทียม','kg',NULL,NULL,NULL,0.478300000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 11:58:30','2026-08-10 11:58:30'),(21,2,2,3,9,6,21,'มันฝรั่ง','kg',NULL,NULL,NULL,0.146300000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 11:58:30','2026-08-10 11:58:30'),(22,2,2,3,9,6,22,'ถั่วฝักยาว','kg',NULL,NULL,NULL,0.323400000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 11:58:30','2026-08-10 11:58:30'),(23,2,2,3,9,6,23,'แตงกวา','kg',NULL,NULL,NULL,0.344100000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 11:58:30','2026-08-10 11:58:30'),(24,2,2,3,9,6,24,'มะนาว','kg',NULL,NULL,NULL,0.204300000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 11:58:30','2026-08-10 11:58:30'),(25,2,2,3,9,6,25,'ใบมะกรูด','kg',NULL,NULL,NULL,0.497300000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 11:58:30','2026-08-10 11:58:30'),(26,2,2,3,9,6,26,'ผลมะกรูด','kg',NULL,NULL,NULL,0.284800000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 11:58:30','2026-08-10 11:58:30'),(27,2,2,3,9,6,27,'กะเพรา','kg',NULL,NULL,NULL,0.502100000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 11:58:30','2026-08-10 11:58:30'),(28,2,2,3,9,6,28,'แครอท','kg',NULL,NULL,NULL,0.266100000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 11:58:30','2026-08-10 11:58:30'),(29,2,2,3,9,6,29,'มะเขือเทศ','kg',NULL,NULL,NULL,0.463300000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 11:58:30','2026-08-10 11:58:30'),(30,2,2,3,9,6,30,'ผักกาดหอม','kg',NULL,NULL,NULL,0.922000000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 11:58:30','2026-08-10 11:58:30'),(31,2,2,3,9,6,31,'พริกขี้หนู','kg',NULL,NULL,NULL,0.413800000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 11:58:30','2026-08-10 11:58:30'),(32,2,2,3,9,6,32,'พริกหวาน','kg',NULL,NULL,NULL,0.544000000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 11:58:30','2026-08-10 11:58:30'),(33,2,2,3,9,6,33,'พริกชี้ฟ้า','kg',NULL,NULL,NULL,0.466800000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 11:58:30','2026-08-10 11:58:30'),(34,2,2,3,9,6,34,'หน่อไม้','kg',NULL,NULL,NULL,1.072600000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 11:58:30','2026-08-10 11:58:30'),(35,2,2,3,9,6,35,'ตะไคร้','kg',NULL,NULL,NULL,0.170700000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 11:58:30','2026-08-10 11:58:30'),(36,2,2,3,9,6,36,'ข่า','kg',NULL,NULL,NULL,0.208500000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 11:58:30','2026-08-10 11:58:30'),(37,2,2,3,9,6,37,'กะหล่ำดอก','kg',NULL,NULL,NULL,0.250200000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 11:58:30','2026-08-10 11:58:30'),(38,2,2,3,9,6,38,'เห็ดฟาง','kg',NULL,NULL,NULL,0.229500000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 11:58:30','2026-08-10 11:58:30'),(39,2,2,3,9,6,39,'งา','kg',NULL,NULL,NULL,0.345600000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 11:58:30','2026-08-10 11:58:30'),(40,2,2,3,9,6,40,'ผักคะน้า','kg',NULL,NULL,NULL,0.240100000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 11:58:30','2026-08-10 11:58:30'),(41,2,2,3,9,6,41,'ผักกาดเขียวกวางตุ้ง','kg',NULL,NULL,NULL,0.193000000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 11:58:30','2026-08-10 11:58:30'),(42,2,2,3,9,6,42,'พริกไทย','kg',NULL,NULL,NULL,1.389100000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 11:58:30','2026-08-10 11:58:30'),(43,2,2,3,9,6,43,'ถั่วแขก','kg',NULL,NULL,NULL,0.300000000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 11:58:30','2026-08-10 11:58:30'),(44,2,2,3,9,6,44,'ชาอูหลง (แห้ง)','kg',NULL,NULL,NULL,11.615200000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 11:58:30','2026-08-10 11:58:30'),(45,2,2,3,9,6,45,'ชาอูหลง (สด)','kg',NULL,NULL,NULL,1.510700000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 11:58:30','2026-08-10 11:58:30'),(46,2,2,3,9,6,46,'กระเจี๊ยบเขียว','kg',NULL,NULL,NULL,0.152800000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 11:58:30','2026-08-10 11:58:30'),(47,2,2,3,9,6,47,'แตงโม','kg',NULL,NULL,NULL,0.484400000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 11:58:30','2026-08-10 11:58:30'),(79,2,2,3,9,6,48,'ส้ม','kg',NULL,NULL,NULL,0.255800000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 12:08:15','2026-08-10 12:08:15'),(80,2,2,3,9,6,49,'เงาะ','kg',NULL,NULL,NULL,0.205000000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 12:08:15','2026-08-10 12:08:15'),(81,2,2,3,9,6,50,'มะม่วง','kg',NULL,NULL,NULL,0.297700000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 12:08:15','2026-08-10 12:08:15'),(82,2,2,3,9,6,51,'ลองกอง','kg',NULL,NULL,NULL,0.610400000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 12:08:15','2026-08-10 12:08:15'),(83,2,2,3,9,6,52,'มะพร้าวน้ำหอม','kg',NULL,NULL,NULL,1.303900000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 12:08:15','2026-08-10 12:08:15'),(84,2,2,3,9,6,53,'มะพร้าว','kg',NULL,NULL,NULL,0.839200000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 12:08:15','2026-08-10 12:08:15'),(85,2,2,3,9,6,54,'สตรอเบอรี่','kg',NULL,NULL,NULL,0.606000000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 12:08:15','2026-08-10 12:08:15'),(86,2,2,3,9,6,55,'กล้วยไข่','kg',NULL,NULL,NULL,0.573700000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 12:08:15','2026-08-10 12:08:15'),(87,2,2,3,9,6,56,'กล้วยหอม','kg',NULL,NULL,NULL,0.611600000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 12:08:15','2026-08-10 12:08:15'),(88,2,2,3,9,6,57,'ฝรั่ง','kg',NULL,NULL,NULL,0.472400000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 12:08:15','2026-08-10 12:08:15'),(89,2,2,3,9,6,58,'องุ่น (ปลูกแบบไม่มีหลังคา)','kg',NULL,NULL,NULL,0.328900000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 12:08:15','2026-08-10 12:08:15'),(90,2,2,3,9,6,59,'องุ่น (ปลูกแบบมีหลังคา)','kg',NULL,NULL,NULL,0.214700000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 12:08:15','2026-08-10 12:08:15'),(91,2,2,3,9,6,60,'ทุเรียน','kg',NULL,NULL,NULL,0.241200000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 12:08:15','2026-08-10 12:08:15'),(92,2,2,3,9,6,61,'ลำไยในฤดู','kg',NULL,NULL,NULL,0.589500000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 12:08:15','2026-08-10 12:08:15'),(93,2,2,3,9,6,62,'ลำไยนอกฤดู','kg',NULL,NULL,NULL,0.975500000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 12:08:15','2026-08-10 12:08:15'),(94,2,2,3,9,6,63,'ลิ้นจี่','kg',NULL,NULL,NULL,1.164900000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 12:08:15','2026-08-10 12:08:15'),(95,2,2,3,9,6,64,'มังคุด','kg',NULL,NULL,NULL,0.928700000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 12:08:15','2026-08-10 12:08:15'),(96,2,2,3,9,6,65,'ส้มเขียวหวาน','kg',NULL,NULL,NULL,0.716900000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 12:08:15','2026-08-10 12:08:15'),(97,2,2,3,9,6,66,'สับปะรดผลสด','kg',NULL,NULL,NULL,0.125000000000,'OTHER','Thai National LCI Database, TIIS-MTEC-NSTDA (with TGO electricity 2022-2024); Update_April2026',2026,'2026-04-01',NULL,1,'ACTIVE','2026-08-10 12:08:15','2026-08-10 12:08:15');
/*!40000 ALTER TABLE `emission_factors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evidence_files`
--

DROP TABLE IF EXISTS `evidence_files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evidence_files` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `activity_id` bigint unsigned NOT NULL,
  `uploaded_by` int unsigned NOT NULL,
  `file_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_path` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_size` bigint unsigned DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_evidence_activity` (`activity_id`),
  KEY `fk_evidence_user` (`uploaded_by`),
  CONSTRAINT `fk_evidence_activity` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_evidence_user` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evidence_files`
--

LOCK TABLES `evidence_files` WRITE;
/*!40000 ALTER TABLE `evidence_files` DISABLE KEYS */;
/*!40000 ALTER TABLE `evidence_files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `material_categories`
--

DROP TABLE IF EXISTS `material_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `material_categories` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `status` enum('ACTIVE','INACTIVE') COLLATE utf8mb4_unicode_ci DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `material_categories`
--

LOCK TABLES `material_categories` WRITE;
/*!40000 ALTER TABLE `material_categories` DISABLE KEYS */;
INSERT INTO `material_categories` VALUES (1,'Meat','เนื้อสัตว์','ACTIVE','2026-08-09 17:24:53','2026-08-09 17:24:53'),(2,'Seafood','อาหารทะเล','ACTIVE','2026-08-09 17:24:53','2026-08-09 17:24:53'),(3,'Vegetable','ผัก','ACTIVE','2026-08-09 17:24:53','2026-08-09 17:24:53'),(4,'Fruit','ผลไม้','ACTIVE','2026-08-09 17:24:53','2026-08-09 17:24:53'),(5,'Grain','ธัญพืชและข้าว','ACTIVE','2026-08-09 17:24:53','2026-08-09 17:24:53'),(6,'Dairy','ผลิตภัณฑ์จากนม','ACTIVE','2026-08-09 17:24:53','2026-08-09 17:24:53'),(7,'Egg','ไข่','ACTIVE','2026-08-09 17:24:53','2026-08-09 17:24:53'),(8,'Oil','น้ำมัน','ACTIVE','2026-08-09 17:24:53','2026-08-09 17:24:53'),(9,'Seasoning','เครื่องปรุง','ACTIVE','2026-08-09 17:24:53','2026-08-09 17:24:53'),(10,'Other','อื่น ๆ','ACTIVE','2026-08-09 17:24:53','2026-08-09 17:24:53');
/*!40000 ALTER TABLE `material_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materials`
--

DROP TABLE IF EXISTS `materials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materials` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `category_id` int unsigned NOT NULL,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `default_unit` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `status` enum('ACTIVE','INACTIVE') COLLATE utf8mb4_unicode_ci DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `fk_material_category` (`category_id`),
  CONSTRAINT `fk_material_category` FOREIGN KEY (`category_id`) REFERENCES `material_categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materials`
--

LOCK TABLES `materials` WRITE;
/*!40000 ALTER TABLE `materials` DISABLE KEYS */;
INSERT INTO `materials` VALUES (1,1,'BEEF','Beef','kg',NULL,'ACTIVE','2026-08-09 17:24:53','2026-08-09 17:24:53'),(2,1,'PORK','Pork','kg',NULL,'ACTIVE','2026-08-09 17:24:53','2026-08-09 17:24:53'),(3,1,'CHICKEN','Chicken','kg',NULL,'ACTIVE','2026-08-09 17:24:53','2026-08-09 17:24:53'),(4,2,'FISH','Fish','kg',NULL,'ACTIVE','2026-08-09 17:24:53','2026-08-09 17:24:53'),(5,5,'RICE','Rice','kg',NULL,'ACTIVE','2026-08-09 17:24:53','2026-08-09 17:24:53'),(6,7,'EGG','Egg','kg',NULL,'ACTIVE','2026-08-09 17:24:53','2026-08-09 17:24:53'),(7,1,'CHICKEN_WHOLE','ไก่สดทั้งตัว','kg',NULL,'ACTIVE','2026-08-10 11:08:59','2026-08-10 11:08:59'),(8,1,'CHICKEN_CUT','ไก่สดชำแหละ','kg',NULL,'ACTIVE','2026-08-10 11:08:59','2026-08-10 11:08:59'),(9,1,'PORK_CUT','สุกรขุนชำแหละ','kg',NULL,'ACTIVE','2026-08-10 11:08:59','2026-08-10 11:08:59'),(10,1,'BEEF_CUT','เนื้อโคชำแหละ','kg',NULL,'ACTIVE','2026-08-10 11:08:59','2026-08-10 11:08:59'),(11,1,'DUCK','เนื้อเป็ด','kg',NULL,'ACTIVE','2026-08-10 11:08:59','2026-08-10 11:16:33'),(12,2,'CATFISH','ปลาดุก','kg',NULL,'ACTIVE','2026-08-10 11:08:59','2026-08-10 11:08:59'),(13,2,'TILAPIA','ปลาทับทิม','kg',NULL,'ACTIVE','2026-08-10 11:08:59','2026-08-10 11:08:59'),(14,5,'RICE_KOR43','ข้าว กข43','kg',NULL,'ACTIVE','2026-08-10 11:43:44','2026-08-10 11:43:44'),(15,5,'RICE_JASMINE','ข้าวหอมมะลิ','kg',NULL,'ACTIVE','2026-08-10 11:43:44','2026-08-10 11:43:44'),(16,3,'CABBAGE','กะหล่ำปลี','kg',NULL,'ACTIVE','2026-08-10 11:57:43','2026-08-10 11:57:43'),(17,3,'BABY_CORN','ข้าวโพดฝักอ่อน','kg',NULL,'ACTIVE','2026-08-10 11:57:43','2026-08-10 11:57:43'),(18,3,'ONION','หอมหัวใหญ่','kg',NULL,'ACTIVE','2026-08-10 11:57:43','2026-08-10 11:57:43'),(19,3,'SHALLOT','หอมแดง','kg',NULL,'ACTIVE','2026-08-10 11:57:43','2026-08-10 11:57:43'),(20,3,'GARLIC','กระเทียม','kg',NULL,'ACTIVE','2026-08-10 11:57:43','2026-08-10 11:57:43'),(21,3,'POTATO','มันฝรั่ง','kg',NULL,'ACTIVE','2026-08-10 11:57:43','2026-08-10 11:57:43'),(22,3,'LONG_BEAN','ถั่วฝักยาว','kg',NULL,'ACTIVE','2026-08-10 11:57:43','2026-08-10 11:57:43'),(23,3,'CUCUMBER','แตงกวา','kg',NULL,'ACTIVE','2026-08-10 11:57:43','2026-08-10 11:57:43'),(24,3,'LIME','มะนาว','kg',NULL,'ACTIVE','2026-08-10 11:57:43','2026-08-10 11:57:43'),(25,3,'KAFFIR_LIME_LEAF','ใบมะกรูด','kg',NULL,'ACTIVE','2026-08-10 11:57:43','2026-08-10 11:57:43'),(26,3,'KAFFIR_LIME','ผลมะกรูด','kg',NULL,'ACTIVE','2026-08-10 11:57:43','2026-08-10 11:57:43'),(27,3,'BASIL','กะเพรา','kg',NULL,'ACTIVE','2026-08-10 11:57:43','2026-08-10 11:57:43'),(28,3,'CARROT','แครอท','kg',NULL,'ACTIVE','2026-08-10 11:57:43','2026-08-10 11:57:43'),(29,3,'TOMATO','มะเขือเทศ','kg',NULL,'ACTIVE','2026-08-10 11:57:43','2026-08-10 11:57:43'),(30,3,'LETTUCE','ผักกาดหอม','kg',NULL,'ACTIVE','2026-08-10 11:57:43','2026-08-10 11:57:43'),(31,3,'BIRD_EYE_CHILI','พริกขี้หนู','kg',NULL,'ACTIVE','2026-08-10 11:57:43','2026-08-10 11:57:43'),(32,3,'BELL_PEPPER','พริกหวาน','kg',NULL,'ACTIVE','2026-08-10 11:57:43','2026-08-10 11:57:43'),(33,3,'CHILI','พริกชี้ฟ้า','kg',NULL,'ACTIVE','2026-08-10 11:57:43','2026-08-10 11:57:43'),(34,3,'BAMBOO_SHOOT','หน่อไม้','kg',NULL,'ACTIVE','2026-08-10 11:57:43','2026-08-10 11:57:43'),(35,3,'LEMONGRASS','ตะไคร้','kg',NULL,'ACTIVE','2026-08-10 11:57:43','2026-08-10 11:57:43'),(36,3,'GALANGAL','ข่า','kg',NULL,'ACTIVE','2026-08-10 11:57:43','2026-08-10 11:57:43'),(37,3,'CAULIFLOWER','กะหล่ำดอก','kg',NULL,'ACTIVE','2026-08-10 11:57:43','2026-08-10 11:57:43'),(38,3,'STRAW_MUSHROOM','เห็ดฟาง','kg',NULL,'ACTIVE','2026-08-10 11:57:43','2026-08-10 11:57:43'),(39,3,'SESAME','งา','kg',NULL,'ACTIVE','2026-08-10 11:57:43','2026-08-10 11:57:43'),(40,3,'KALE','ผักคะน้า','kg',NULL,'ACTIVE','2026-08-10 11:57:43','2026-08-10 11:57:43'),(41,3,'PAK_CHOI','ผักกาดเขียวกวางตุ้ง','kg',NULL,'ACTIVE','2026-08-10 11:57:43','2026-08-10 11:57:43'),(42,3,'PEPPER','พริกไทย','kg',NULL,'ACTIVE','2026-08-10 11:57:43','2026-08-10 11:57:43'),(43,3,'GREEN_BEAN','ถั่วแขก','kg',NULL,'ACTIVE','2026-08-10 11:57:43','2026-08-10 11:57:43'),(44,3,'OOLONG_TEA_DRY','ชาอูหลง (แห้ง)','kg',NULL,'ACTIVE','2026-08-10 11:57:43','2026-08-10 11:57:43'),(45,3,'OOLONG_TEA_FRESH','ชาอูหลง (สด)','kg',NULL,'ACTIVE','2026-08-10 11:57:43','2026-08-10 11:57:43'),(46,3,'OKRA','กระเจี๊ยบเขียว','kg',NULL,'ACTIVE','2026-08-10 11:57:43','2026-08-10 11:57:43'),(47,3,'WATERMELON','แตงโม','kg',NULL,'ACTIVE','2026-08-10 11:57:43','2026-08-10 11:57:43'),(48,4,'ORANGE','ส้ม','kg',NULL,'ACTIVE','2026-08-10 12:07:28','2026-08-10 12:07:28'),(49,4,'RAMBUTAN','เงาะ','kg',NULL,'ACTIVE','2026-08-10 12:07:28','2026-08-10 12:07:28'),(50,4,'MANGO','มะม่วง','kg',NULL,'ACTIVE','2026-08-10 12:07:28','2026-08-10 12:07:28'),(51,4,'LONGKONG','ลองกอง','kg',NULL,'ACTIVE','2026-08-10 12:07:28','2026-08-10 12:07:28'),(52,4,'AROMATIC_COCONUT','มะพร้าวน้ำหอม','kg',NULL,'ACTIVE','2026-08-10 12:07:28','2026-08-10 12:07:28'),(53,4,'COCONUT','มะพร้าว','kg',NULL,'ACTIVE','2026-08-10 12:07:28','2026-08-10 12:07:28'),(54,4,'STRAWBERRY','สตรอเบอรี่','kg',NULL,'ACTIVE','2026-08-10 12:07:28','2026-08-10 12:07:28'),(55,4,'KLUAI_KHAI','กล้วยไข่','kg',NULL,'ACTIVE','2026-08-10 12:07:28','2026-08-10 12:07:28'),(56,4,'KLUAI_HOM','กล้วยหอม','kg',NULL,'ACTIVE','2026-08-10 12:07:28','2026-08-10 12:07:28'),(57,4,'GUAVA','ฝรั่ง','kg',NULL,'ACTIVE','2026-08-10 12:07:28','2026-08-10 12:07:28'),(58,4,'GRAPE_OPEN','องุ่น (ปลูกแบบไม่มีหลังคา)','kg',NULL,'ACTIVE','2026-08-10 12:07:28','2026-08-10 12:07:28'),(59,4,'GRAPE_COVERED','องุ่น (ปลูกแบบมีหลังคา)','kg',NULL,'ACTIVE','2026-08-10 12:07:28','2026-08-10 12:07:28'),(60,4,'DURIAN','ทุเรียน','kg',NULL,'ACTIVE','2026-08-10 12:07:28','2026-08-10 12:07:28'),(61,4,'LONGAN_IN_SEASON','ลำไยในฤดู','kg',NULL,'ACTIVE','2026-08-10 12:07:28','2026-08-10 12:07:28'),(62,4,'LONGAN_OFF_SEASON','ลำไยนอกฤดู','kg',NULL,'ACTIVE','2026-08-10 12:07:28','2026-08-10 12:07:28'),(63,4,'LYCHEE','ลิ้นจี่','kg',NULL,'ACTIVE','2026-08-10 12:07:28','2026-08-10 12:07:28'),(64,4,'MANGOSTEEN','มังคุด','kg',NULL,'ACTIVE','2026-08-10 12:07:28','2026-08-10 12:07:28'),(65,4,'SWEET_ORANGE','ส้มเขียวหวาน','kg',NULL,'ACTIVE','2026-08-10 12:07:28','2026-08-10 12:07:28'),(66,4,'PINEAPPLE_FRESH','สับปะรดผลสด','kg',NULL,'ACTIVE','2026-08-10 12:07:28','2026-08-10 12:07:28');
/*!40000 ALTER TABLE `materials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `report_details`
--

DROP TABLE IF EXISTS `report_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `report_details` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `report_id` bigint unsigned NOT NULL,
  `scope_id` tinyint unsigned NOT NULL,
  `category_id` int unsigned DEFAULT NULL,
  `total_emissions` decimal(20,6) DEFAULT '0.000000',
  `total_removals` decimal(20,6) DEFAULT '0.000000',
  `net_emissions` decimal(20,6) DEFAULT '0.000000',
  `percentage` decimal(10,4) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_report_detail_report` (`report_id`),
  KEY `fk_report_detail_scope` (`scope_id`),
  KEY `fk_report_detail_category` (`category_id`),
  CONSTRAINT `fk_report_detail_category` FOREIGN KEY (`category_id`) REFERENCES `scope_categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_report_detail_report` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_report_detail_scope` FOREIGN KEY (`scope_id`) REFERENCES `scopes` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report_details`
--

LOCK TABLES `report_details` WRITE;
/*!40000 ALTER TABLE `report_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `report_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reporting_periods`
--

DROP TABLE IF EXISTS `reporting_periods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reporting_periods` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `year` year NOT NULL,
  `status` enum('OPEN','CLOSED') COLLATE utf8mb4_unicode_ci DEFAULT 'OPEN',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reporting_periods`
--

LOCK TABLES `reporting_periods` WRITE;
/*!40000 ALTER TABLE `reporting_periods` DISABLE KEYS */;
INSERT INTO `reporting_periods` VALUES (1,'Reporting Year 2026','2026-01-01','2026-12-31',2026,'OPEN','2026-08-09 17:24:54','2026-08-09 17:24:54');
/*!40000 ALTER TABLE `reporting_periods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reports`
--

DROP TABLE IF EXISTS `reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reports` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `reporting_period_id` int unsigned NOT NULL,
  `created_by` int unsigned NOT NULL,
  `report_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `scope1_total` decimal(20,6) DEFAULT '0.000000',
  `scope2_total` decimal(20,6) DEFAULT '0.000000',
  `scope3_total` decimal(20,6) DEFAULT '0.000000',
  `total_emissions` decimal(20,6) DEFAULT '0.000000',
  `total_removals` decimal(20,6) DEFAULT '0.000000',
  `net_emissions` decimal(20,6) DEFAULT '0.000000',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_report_period` (`reporting_period_id`),
  KEY `fk_report_creator` (`created_by`),
  CONSTRAINT `fk_report_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_report_period` FOREIGN KEY (`reporting_period_id`) REFERENCES `reporting_periods` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reports`
--

LOCK TABLES `reports` WRITE;
/*!40000 ALTER TABLE `reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'ADMIN','System administrator','2026-08-09 17:24:53','2026-08-09 17:24:53'),(2,'STAFF','Staff who records activity data','2026-08-09 17:24:53','2026-08-09 17:24:53'),(3,'MANAGER','Manager who reviews reports','2026-08-09 17:24:53','2026-08-09 17:24:53');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scope_categories`
--

DROP TABLE IF EXISTS `scope_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `scope_categories` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `scope_id` tinyint unsigned NOT NULL,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `status` enum('ACTIVE','INACTIVE') COLLATE utf8mb4_unicode_ci DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_scope_category` (`scope_id`,`code`),
  CONSTRAINT `fk_categories_scope` FOREIGN KEY (`scope_id`) REFERENCES `scopes` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scope_categories`
--

LOCK TABLES `scope_categories` WRITE;
/*!40000 ALTER TABLE `scope_categories` DISABLE KEYS */;
INSERT INTO `scope_categories` VALUES (1,1,'S1_STATIONARY','Stationary Combustion','การเผาไหม้เชื้อเพลิงจากแหล่งกำเนิดอยู่กับที่','ACTIVE','2026-08-09 17:24:53','2026-08-09 17:24:53'),(2,1,'S1_MOBILE','Mobile Combustion','การเผาไหม้เชื้อเพลิงจากยานพาหนะหรืออุปกรณ์เคลื่อนที่','ACTIVE','2026-08-09 17:24:53','2026-08-09 17:24:53'),(3,1,'S1_FUGITIVE','Fugitive Emissions','การปล่อยก๊าซเรือนกระจกแบบฟุ้งกระจาย เช่น สารทำความเย็น','ACTIVE','2026-08-09 17:24:53','2026-08-09 17:24:53'),(4,1,'S1_REMOVALS','Direct Removals','การดูดกลับก๊าซเรือนกระจกทางตรง','ACTIVE','2026-08-09 17:24:53','2026-08-09 17:24:53'),(5,2,'S2_ELECTRICITY','Purchased Electricity','การใช้ไฟฟ้าที่ซื้อจากภายนอก','ACTIVE','2026-08-09 17:24:53','2026-08-09 17:24:53'),(6,2,'S2_STEAM','Purchased Steam','การใช้ไอน้ำที่ซื้อจากภายนอก','ACTIVE','2026-08-09 17:24:53','2026-08-09 17:24:53'),(7,2,'S2_HEAT','Purchased Heating','การใช้ความร้อนที่ซื้อจากภายนอก','ACTIVE','2026-08-09 17:24:53','2026-08-09 17:24:53'),(8,2,'S2_COOLING','Purchased Cooling','การใช้ความเย็นที่ซื้อจากภายนอก','ACTIVE','2026-08-09 17:24:53','2026-08-09 17:24:53'),(9,3,'S3_CAT1','Purchased Goods and Services','การจัดซื้อสินค้าและบริการ','ACTIVE','2026-08-09 17:24:53','2026-08-09 17:24:53'),(10,3,'S3_CAT2','Capital Goods','สินทรัพย์ทุน','ACTIVE','2026-08-09 17:24:53','2026-08-09 17:24:53'),(11,3,'S3_CAT3','Fuel and Energy Related Activities','กิจกรรมที่เกี่ยวข้องกับเชื้อเพลิงและพลังงาน','ACTIVE','2026-08-09 17:24:53','2026-08-09 17:24:53'),(12,3,'S3_CAT4','Upstream Transportation','การขนส่งและกระจายสินค้าขาเข้า','ACTIVE','2026-08-09 17:24:53','2026-08-09 17:24:53'),(13,3,'S3_CAT5','Waste Generated in Operations','ของเสียที่เกิดจากการดำเนินงาน','ACTIVE','2026-08-09 17:24:53','2026-08-09 17:24:53'),(14,3,'S3_CAT6','Business Travel','การเดินทางเพื่อธุรกิจ','ACTIVE','2026-08-09 17:24:53','2026-08-09 17:24:53'),(15,3,'S3_CAT7','Employee Commuting','การเดินทางของพนักงาน','ACTIVE','2026-08-09 17:24:53','2026-08-09 17:24:53');
/*!40000 ALTER TABLE `scope_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scopes`
--

DROP TABLE IF EXISTS `scopes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `scopes` (
  `id` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scopes`
--

LOCK TABLES `scopes` WRITE;
/*!40000 ALTER TABLE `scopes` DISABLE KEYS */;
INSERT INTO `scopes` VALUES (1,'SCOPE_1','Direct GHG Emissions and Removals','การปล่อยและดูดกลับก๊าซเรือนกระจกทางตรงขององค์กร','2026-08-09 17:24:53','2026-08-09 17:24:53'),(2,'SCOPE_2','Energy Indirect GHG Emissions','การปล่อยก๊าซเรือนกระจกทางอ้อมจากการใช้พลังงาน','2026-08-09 17:24:53','2026-08-09 17:24:53'),(3,'SCOPE_3','Other Indirect GHG Emissions','การปล่อยก๊าซเรือนกระจกทางอ้อมอื่น ๆ','2026-08-09 17:24:53','2026-08-09 17:24:53');
/*!40000 ALTER TABLE `scopes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suppliers` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `status` enum('ACTIVE','INACTIVE') COLLATE utf8mb4_unicode_ci DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suppliers`
--

LOCK TABLES `suppliers` WRITE;
/*!40000 ALTER TABLE `suppliers` DISABLE KEYS */;
/*!40000 ALTER TABLE `suppliers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `role_id` int unsigned NOT NULL,
  `username` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `google_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `first_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE') COLLATE utf8mb4_unicode_ci DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `google_id` (`google_id`),
  KEY `fk_users_role` (`role_id`),
  CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,2,'teststaff','$2b$10$tNYQCi0EoAweQOTAgoAmZuBEWvffLHQhNHHv5.FrSLCw8q3VXA4LG',NULL,'Test','Staff','teststaff@example.com','ACTIVE','2026-08-09 20:27:46','2026-08-24 16:54:02'),(4,2,'kittisak@gmail.com','$2b$10$ceSPKBbsxrsl4tW0NMjiQuOrR4.zLxmllJL4rPGa4YPsNh.7ip6Xy',NULL,'กิตติศักดิ์','ภิญโญดม','kittisakpinyodom@gmail.com','ACTIVE','2026-08-25 12:09:02','2026-08-25 12:09:02');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `v_active_emission_factors`
--

DROP TABLE IF EXISTS `v_active_emission_factors`;
/*!50001 DROP VIEW IF EXISTS `v_active_emission_factors`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_active_emission_factors` AS SELECT 
 1 AS `id`,
 1 AS `name`,
 1 AS `unit`,
 1 AS `co2_factor`,
 1 AS `ch4_factor`,
 1 AS `n2o_factor`,
 1 AS `total_co2e_factor`,
 1 AS `emission_type`,
 1 AS `scope_code`,
 1 AS `scope_name`,
 1 AS `category_code`,
 1 AS `category_name`,
 1 AS `activity_code`,
 1 AS `activity_name`,
 1 AS `version_name`,
 1 AS `source_name`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `v_active_emission_factors`
--

/*!50001 DROP VIEW IF EXISTS `v_active_emission_factors`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_active_emission_factors` AS select `ef`.`id` AS `id`,`ef`.`name` AS `name`,`ef`.`unit` AS `unit`,`ef`.`co2_factor` AS `co2_factor`,`ef`.`ch4_factor` AS `ch4_factor`,`ef`.`n2o_factor` AS `n2o_factor`,`ef`.`total_co2e_factor` AS `total_co2e_factor`,`ef`.`emission_type` AS `emission_type`,`s`.`code` AS `scope_code`,`s`.`name` AS `scope_name`,`sc`.`code` AS `category_code`,`sc`.`name` AS `category_name`,`at`.`code` AS `activity_code`,`at`.`name` AS `activity_name`,`efv`.`version_name` AS `version_name`,`efs`.`name` AS `source_name` from (((((`emission_factors` `ef` left join `scopes` `s` on((`ef`.`scope_id` = `s`.`id`))) left join `scope_categories` `sc` on((`ef`.`category_id` = `sc`.`id`))) left join `activity_types` `at` on((`ef`.`activity_type_id` = `at`.`id`))) join `emission_factor_versions` `efv` on((`ef`.`version_id` = `efv`.`id`))) join `emission_factor_sources` `efs` on((`ef`.`source_id` = `efs`.`id`))) where ((`ef`.`status` = 'ACTIVE') and (`efv`.`status` = 'ACTIVE')) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-02  0:10:07
