-- MySQL dump 10.13  Distrib 8.4.8, for Linux (x86_64)
--
-- Host: localhost    Database: dimisa
-- ------------------------------------------------------
-- Server version	8.4.8

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin_users`
--

DROP TABLE IF EXISTS `admin_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_users` (
  `id_user` int NOT NULL,
  PRIMARY KEY (`id_user`),
  CONSTRAINT `fk_admin_user_usuario` FOREIGN KEY (`id_user`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `admision_users`
--

DROP TABLE IF EXISTS `admision_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admision_users` (
  `id_user` int NOT NULL,
  PRIMARY KEY (`id_user`),
  CONSTRAINT `fk_admision_user` FOREIGN KEY (`id_user`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `areas`
--

DROP TABLE IF EXISTS `areas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `areas` (
  `id_area` int NOT NULL AUTO_INCREMENT,
  `nombre_area` varchar(45) NOT NULL,
  `alias` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id_area`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `areas_cendis`
--

DROP TABLE IF EXISTS `areas_cendis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `areas_cendis` (
  `id_areas_cendis` int NOT NULL AUTO_INCREMENT,
  `id_area` int NOT NULL,
  `id_cendis` int NOT NULL,
  PRIMARY KEY (`id_areas_cendis`),
  UNIQUE KEY `uq_area_cendis` (`id_area`),
  KEY `idx_areas_cendis_cendis` (`id_cendis`),
  CONSTRAINT `fk_areas_cendis_area` FOREIGN KEY (`id_area`) REFERENCES `areas` (`id_area`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_areas_cendis_cendis` FOREIGN KEY (`id_cendis`) REFERENCES `cendis` (`id_cendis`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cama_medicamento`
--

DROP TABLE IF EXISTS `cama_medicamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cama_medicamento` (
  `id_cama_medicamento` int NOT NULL AUTO_INCREMENT,
  `id_cama` int NOT NULL,
  `id_medicamento` int NOT NULL,
  `cantidad` int NOT NULL,
  PRIMARY KEY (`id_cama_medicamento`),
  KEY `idx_cama_medicamento_cama` (`id_cama`),
  KEY `idx_cama_medicamento_medicamento` (`id_medicamento`),
  CONSTRAINT `fk_cama_medicamento_cama` FOREIGN KEY (`id_cama`) REFERENCES `camas` (`id_cama`) ON DELETE RESTRICT,
  CONSTRAINT `fk_cama_medicamento_medicamento` FOREIGN KEY (`id_medicamento`) REFERENCES `medicamentos` (`id_medicamento`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `camas`
--

DROP TABLE IF EXISTS `camas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `camas` (
  `id_cama` int NOT NULL AUTO_INCREMENT,
  `id_area` int NOT NULL,
  `numero_cama` int NOT NULL,
  `nombres` varchar(45) DEFAULT NULL,
  `apellido1` varchar(45) DEFAULT NULL,
  `apellido2` varchar(45) DEFAULT NULL,
  `fecha_nac` varchar(45) DEFAULT NULL,
  `expediente` varchar(45) DEFAULT NULL,
  `riesgo_caida` enum('Bajo','Medio','Alto') DEFAULT NULL,
  `riesgo_ulcera` enum('Bajo','Medio','Alto') DEFAULT NULL,
  `habilitada` tinyint(1) NOT NULL DEFAULT '1',
  `occupied` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id_cama`),
  KEY `idx_cama_area` (`id_area`),
  CONSTRAINT `fk_camas_area` FOREIGN KEY (`id_area`) REFERENCES `areas` (`id_area`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=371 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cendis`
--

DROP TABLE IF EXISTS `cendis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cendis` (
  `id_cendis` int NOT NULL AUTO_INCREMENT,
  `cendis_nombre` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_cendis`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `colectivo_detalle`
--

DROP TABLE IF EXISTS `colectivo_detalle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `colectivo_detalle` (
  `id_detalle` int NOT NULL AUTO_INCREMENT,
  `id_colectivo` int NOT NULL,
  `id_cama` int DEFAULT NULL,
  `id_medicamento` int NOT NULL,
  `cantidad` int NOT NULL,
  PRIMARY KEY (`id_detalle`),
  KEY `idx_detalle_colectivo` (`id_colectivo`),
  KEY `idx_detalle_medicamento` (`id_medicamento`),
  KEY `idx_detalle_cama` (`id_cama`),
  CONSTRAINT `fk_detalle_cama` FOREIGN KEY (`id_cama`) REFERENCES `camas` (`id_cama`) ON DELETE RESTRICT,
  CONSTRAINT `fk_detalle_colectivo` FOREIGN KEY (`id_colectivo`) REFERENCES `colectivos` (`id_colectivo`) ON DELETE CASCADE,
  CONSTRAINT `fk_detalle_medicamento` FOREIGN KEY (`id_medicamento`) REFERENCES `medicamentos` (`id_medicamento`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `colectivos`
--

DROP TABLE IF EXISTS `colectivos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `colectivos` (
  `id_colectivo` int NOT NULL AUTO_INCREMENT,
  `folio` varchar(20) DEFAULT NULL,
  `fecha` date NOT NULL,
  `id_user` int NOT NULL,
  `id_area` int DEFAULT NULL,
  `id_turno` int DEFAULT NULL,
  `id_cendis` int NOT NULL,
  `capturado` tinyint(1) NOT NULL DEFAULT '0',
  `editable` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_colectivo`),
  KEY `idx_colectivo_user` (`id_user`),
  KEY `idx_colectivo_area` (`id_area`),
  KEY `idx_colectivo_turno` (`id_turno`),
  KEY `idx_colectivo_cendis` (`id_cendis`),
  CONSTRAINT `fk_colectivo_area` FOREIGN KEY (`id_area`) REFERENCES `areas` (`id_area`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_colectivo_cendis` FOREIGN KEY (`id_cendis`) REFERENCES `cendis` (`id_cendis`),
  CONSTRAINT `fk_colectivo_turno` FOREIGN KEY (`id_turno`) REFERENCES `turnos` (`id_turno`),
  CONSTRAINT `fk_colectivo_user` FOREIGN KEY (`id_user`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `enfermeria_users`
--

DROP TABLE IF EXISTS `enfermeria_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enfermeria_users` (
  `id_user` int NOT NULL,
  `id_area` int NOT NULL,
  `id_turno` int DEFAULT NULL,
  PRIMARY KEY (`id_user`),
  KEY `idx_enfermeria_area` (`id_area`),
  KEY `idx_enfermeria_turno` (`id_turno`),
  CONSTRAINT `fk_enfermeria_area` FOREIGN KEY (`id_area`) REFERENCES `areas` (`id_area`) ON DELETE RESTRICT,
  CONSTRAINT `fk_enfermeria_turno` FOREIGN KEY (`id_turno`) REFERENCES `turnos` (`id_turno`) ON DELETE RESTRICT,
  CONSTRAINT `fk_enfermeria_user` FOREIGN KEY (`id_user`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `inventarios`
--

DROP TABLE IF EXISTS `inventarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventarios` (
  `id_inventario` int NOT NULL AUTO_INCREMENT,
  `id_cendis` int NOT NULL,
  `id_medicamento` int NOT NULL,
  `cantidad_actual` int NOT NULL,
  `updated_at` date DEFAULT NULL,
  PRIMARY KEY (`id_inventario`),
  UNIQUE KEY `idx_cendis_medicamento` (`id_cendis`,`id_medicamento`),
  KEY `idx_inventario_cendis` (`id_cendis`),
  KEY `idx_inventario_medicamento` (`id_medicamento`),
  CONSTRAINT `fk_inventario_cendis` FOREIGN KEY (`id_cendis`) REFERENCES `cendis` (`id_cendis`),
  CONSTRAINT `fk_inventario_medicamento` FOREIGN KEY (`id_medicamento`) REFERENCES `medicamentos` (`id_medicamento`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jefes_users`
--

DROP TABLE IF EXISTS `jefes_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jefes_users` (
  `id_user` int NOT NULL,
  PRIMARY KEY (`id_user`),
  CONSTRAINT `fk_jefes_user_usuario` FOREIGN KEY (`id_user`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `medicamentos`
--

DROP TABLE IF EXISTS `medicamentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicamentos` (
  `id_medicamento` int NOT NULL AUTO_INCREMENT,
  `clave_med` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `id_presentacion` int DEFAULT NULL,
  PRIMARY KEY (`id_medicamento`),
  KEY `idx_medicamento_presentacion` (`id_presentacion`),
  CONSTRAINT `fk_medicamento_presentacion` FOREIGN KEY (`id_presentacion`) REFERENCES `presentaciones` (`id_presentacion`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=15470 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `movimientos_inventarios`
--

DROP TABLE IF EXISTS `movimientos_inventarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movimientos_inventarios` (
  `id_movimiento_inventario` int NOT NULL AUTO_INCREMENT,
  `id_inventario` int NOT NULL,
  `id_cendis` int NOT NULL,
  `id_medicamento` int NOT NULL,
  `tipo_movimiento` enum('Entrada','Salida') NOT NULL,
  PRIMARY KEY (`id_movimiento_inventario`),
  KEY `idx_mov_cendis` (`id_cendis`),
  KEY `idx_mov_medicamento` (`id_medicamento`),
  KEY `idx_mov_inventario` (`id_inventario`),
  CONSTRAINT `fk_mov_cendis` FOREIGN KEY (`id_cendis`) REFERENCES `cendis` (`id_cendis`),
  CONSTRAINT `fk_mov_inventario` FOREIGN KEY (`id_inventario`) REFERENCES `inventarios` (`id_inventario`),
  CONSTRAINT `fk_mov_medicamento` FOREIGN KEY (`id_medicamento`) REFERENCES `medicamentos` (`id_medicamento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `presentaciones`
--

DROP TABLE IF EXISTS `presentaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `presentaciones` (
  `id_presentacion` int NOT NULL AUTO_INCREMENT,
  `presentacion` varchar(45) NOT NULL,
  PRIMARY KEY (`id_presentacion`),
  UNIQUE KEY `uq_presentacion` (`presentacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id_rol` int NOT NULL AUTO_INCREMENT,
  `rol` varchar(45) NOT NULL,
  PRIMARY KEY (`id_rol`),
  UNIQUE KEY `uq_rol` (`rol`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `salidas`
--

DROP TABLE IF EXISTS `salidas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salidas` (
  `id_salida` int NOT NULL AUTO_INCREMENT,
  `id_area` int NOT NULL,
  `id_cendis` int NOT NULL,
  `id_usuario` int NOT NULL,
  `fecha` date NOT NULL,
  `created_at` date DEFAULT NULL,
  `editable` tinyint(1) NOT NULL DEFAULT '1',
  `pendiente` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_salida`),
  KEY `idx_salidas_area` (`id_area`),
  KEY `idx_salidas_cendis` (`id_cendis`),
  KEY `idx_salidas_usuario` (`id_usuario`),
  CONSTRAINT `fk_salidas_area` FOREIGN KEY (`id_area`) REFERENCES `areas` (`id_area`),
  CONSTRAINT `fk_salidas_cendis` FOREIGN KEY (`id_cendis`) REFERENCES `cendis` (`id_cendis`),
  CONSTRAINT `fk_salidas_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `salidas_aux`
--

DROP TABLE IF EXISTS `salidas_aux`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salidas_aux` (
  `id_aux` int NOT NULL AUTO_INCREMENT,
  `id_cendis` int NOT NULL,
  `id_medicamento` int NOT NULL,
  `fecha` date NOT NULL,
  `cantidad` int DEFAULT NULL,
  PRIMARY KEY (`id_aux`),
  KEY `idx_sa_cendis` (`id_cendis`),
  KEY `idx_sa_medicamento` (`id_medicamento`),
  CONSTRAINT `fk_sa_cendis` FOREIGN KEY (`id_cendis`) REFERENCES `cendis` (`id_cendis`),
  CONSTRAINT `fk_sa_medicamento` FOREIGN KEY (`id_medicamento`) REFERENCES `medicamentos` (`id_medicamento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `salidas_detalle`
--

DROP TABLE IF EXISTS `salidas_detalle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salidas_detalle` (
  `id_salida_detalle` int NOT NULL AUTO_INCREMENT,
  `id_salida` int NOT NULL,
  `id_medicamento` int NOT NULL,
  `cantidad` int NOT NULL,
  PRIMARY KEY (`id_salida_detalle`),
  KEY `idx_sd_medicamento` (`id_medicamento`),
  KEY `idx_sd_salida` (`id_salida`),
  CONSTRAINT `fk_sd_medicamento` FOREIGN KEY (`id_medicamento`) REFERENCES `medicamentos` (`id_medicamento`),
  CONSTRAINT `fk_sd_salida` FOREIGN KEY (`id_salida`) REFERENCES `salidas` (`id_salida`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `turnos`
--

DROP TABLE IF EXISTS `turnos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `turnos` (
  `id_turno` int NOT NULL AUTO_INCREMENT,
  `turno` varchar(45) NOT NULL,
  PRIMARY KEY (`id_turno`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `unidosis_users`
--

DROP TABLE IF EXISTS `unidosis_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `unidosis_users` (
  `id_user` int NOT NULL,
  `id_cendis` int NOT NULL,
  `id_turno` int DEFAULT NULL,
  PRIMARY KEY (`id_user`),
  KEY `idx_unidosis_cendis` (`id_cendis`),
  KEY `idx_unidosis_turno` (`id_turno`),
  CONSTRAINT `fk_unidosis_cendis` FOREIGN KEY (`id_cendis`) REFERENCES `cendis` (`id_cendis`) ON DELETE RESTRICT,
  CONSTRAINT `fk_unidosis_turno` FOREIGN KEY (`id_turno`) REFERENCES `turnos` (`id_turno`) ON DELETE RESTRICT,
  CONSTRAINT `fk_unidosis_user` FOREIGN KEY (`id_user`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombres` varchar(45) NOT NULL,
  `apellido1` varchar(45) NOT NULL,
  `apellido2` varchar(45) NOT NULL,
  `username` varchar(45) NOT NULL,
  `password` varchar(100) DEFAULT NULL,
  `id_rol` int DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  KEY `idx_usuario_rol` (`id_rol`),
  CONSTRAINT `fk_usuario_rol` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-15  1:41:12
