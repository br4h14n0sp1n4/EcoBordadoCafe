-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         8.4.3 - MySQL Community Server - GPL
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para ecobordado
CREATE DATABASE IF NOT EXISTS `ecobordado` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `ecobordado`;

-- Volcando estructura para tabla ecobordado.categoria
CREATE TABLE IF NOT EXISTS `categoria` (
  `ID_Categoria` int NOT NULL,
  `Nombre` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID_Categoria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla ecobordado.categoria: ~3 rows (aproximadamente)
REPLACE INTO `categoria` (`ID_Categoria`, `Nombre`) VALUES
	(1, 'Cafes'),
	(2, 'Panes'),
	(3, 'Bordados');

-- Volcando estructura para tabla ecobordado.cliente
CREATE TABLE IF NOT EXISTS `cliente` (
  `ID_Cliente` int NOT NULL,
  `Nombre` varchar(100) DEFAULT NULL,
  `Apellido` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Correo electronico` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Telefono` varchar(20) DEFAULT NULL,
  `Documento` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`ID_Cliente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla ecobordado.cliente: ~3 rows (aproximadamente)
REPLACE INTO `cliente` (`ID_Cliente`, `Nombre`, `Apellido`, `Correo electronico`, `Telefono`, `Documento`) VALUES
	(1, 'Sebastian', 'Rua', 'srua@iegabo.edu.co', '3002070525', '1965865432'),
	(2, 'Heiller', 'Gutierrez', 'hstiven@iegabo.edu.co', '3125447294', '1077654873'),
	(3, 'Alejandro', 'Gallego', 'agallego@iegabo.edu.co', '3116701143', '1071675392');

-- Volcando estructura para tabla ecobordado.detalle_venta
CREATE TABLE IF NOT EXISTS `detalle_venta` (
  `ID_Detalle` int NOT NULL,
  `ID_Venta` int DEFAULT NULL,
  `Cantidad` int DEFAULT NULL,
  `ID_Producto` int DEFAULT NULL,
  PRIMARY KEY (`ID_Detalle`),
  KEY `ID_Venta` (`ID_Venta`),
  KEY `ID_Producto` (`ID_Producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla ecobordado.detalle_venta: ~5 rows (aproximadamente)
REPLACE INTO `detalle_venta` (`ID_Detalle`, `ID_Venta`, `Cantidad`, `ID_Producto`) VALUES
	(1, 1, 2, 1),
	(2, 2, 3, 4),
	(3, 3, 2, 7),
	(4, 4, 1, 5),
	(5, 5, 5, 13);

-- Volcando estructura para tabla ecobordado.empleado
CREATE TABLE IF NOT EXISTS `empleado` (
  `ID_Empleado` int NOT NULL,
  `Nombre` varchar(100) DEFAULT NULL,
  `Apellido` varchar(100) DEFAULT NULL,
  `Cargo` varchar(50) DEFAULT NULL,
  `Telefono` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Correo` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID_Empleado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla ecobordado.empleado: ~3 rows (aproximadamente)
REPLACE INTO `empleado` (`ID_Empleado`, `Nombre`, `Apellido`, `Cargo`, `Telefono`, `Correo`) VALUES
	(1, 'Brahian Mauricio', 'Ospina Restrepo', 'Gerente', '3019872833', 'bmospina@iegabo.edu.co'),
	(2, 'Daniel', 'Silva Correa', 'Secretario', '3218466769', 'dsilva@iegabo.edu.co'),
	(3, 'Yerik Samuel', 'Bocanegra Osorio', 'Vendedor', '3008578354', 'ysbocanegra@iegabo.edu.co');

-- Volcando estructura para tabla ecobordado.producto
CREATE TABLE IF NOT EXISTS `producto` (
  `ID_Producto` int NOT NULL,
  `Nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Descripcion` text,
  `Precio` float DEFAULT NULL,
  `Stock` int DEFAULT NULL,
  `ID_Categoria` int DEFAULT NULL,
  `ID_Proveedor` int DEFAULT NULL,
  PRIMARY KEY (`ID_Producto`),
  KEY `ID_Categoria` (`ID_Categoria`),
  KEY `ID_Proveedor` (`ID_Proveedor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla ecobordado.producto: ~22 rows (aproximadamente)
REPLACE INTO `producto` (`ID_Producto`, `Nombre`, `Descripcion`, `Precio`, `Stock`, `ID_Categoria`, `ID_Proveedor`) VALUES
	(1, 'Bolsa de Cafe filtrado artesanal', NULL, 40000, 50, 1, 1),
	(2, 'Caja con sobres de Capucchino', NULL, 45000, 50, 1, 1),
	(3, 'Bolsa de Infusiones de hierbas locales', NULL, 18000, 50, 1, 1),
	(4, 'Pan de masa madre', NULL, 15000, 50, 1, 1),
	(5, 'Paquete de Galletas artesanales', NULL, 15000, 50, 2, 2),
	(6, 'Pastel mediano / Unidad', NULL, 16000, 50, 2, 2),
	(7, 'Camisas bordadas / Unidad', NULL, 80000, 50, 3, 3),
	(8, 'Bolsos bordados / Unidad', NULL, 50000, 50, 3, 3),
	(9, 'Manteles tematicos bordados / Unidad', NULL, 120000, 50, 3, 3),
	(10, 'Café preparado en taza', NULL, 6000, 50, 1, 1),
	(11, 'Café Latte', NULL, 10000, 50, 1, 1),
	(12, 'Café frío', NULL, 9000, 50, 1, 1),
	(13, 'Café Espresso', NULL, 5000, 50, 1, 1),
	(14, 'Capuchino preparado', NULL, 9000, 50, 1, 1),
	(15, 'Chocolate Caliente', NULL, 7000, 50, 1, 1),
	(16, 'Sandwich artesanal', NULL, 15000, 50, 2, 2),
	(17, 'Pan de masa madre porción', NULL, 6000, 50, 2, 2),
	(18, 'Porcion de torta casera', NULL, 8000, 50, 2, 2),
	(19, 'Galletas temáticas', NULL, 15000, 50, 2, 2),
	(20, 'Cafe preparado para llevar', NULL, 8000, 50, 1, 1),
	(21, 'Caja de regalo de cafe artesanal', NULL, 40000, 50, 1, 1),
	(22, 'Paquete de galletas surtidas', NULL, 18000, 50, 2, 2);

-- Volcando estructura para tabla ecobordado.proveedor
CREATE TABLE IF NOT EXISTS `proveedor` (
  `ID_Proveedor` int NOT NULL,
  `Nombre` varchar(100) DEFAULT NULL,
  `Telefono` varchar(20) DEFAULT NULL,
  `Direccion` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`ID_Proveedor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla ecobordado.proveedor: ~3 rows (aproximadamente)
REPLACE INTO `proveedor` (`ID_Proveedor`, `Nombre`, `Telefono`, `Direccion`) VALUES
	(1, 'Cafe Amor y Perfecto', '3153205246', 'Medellin, Carrera 48 #7-340 local 340'),
	(2, 'Multipan', '3143597267', 'Bogotá, Calle 144 # 49-30'),
	(3, 'TexMundo', '3024618507', 'Bogotá, Av. Calle 63 No. 74B - 42, bodega 19');

-- Volcando estructura para tabla ecobordado.venta
CREATE TABLE IF NOT EXISTS `venta` (
  `ID_Venta` int NOT NULL,
  `Fecha` date DEFAULT NULL,
  `ID_Cliente` int DEFAULT NULL,
  `ID_Empleado` int DEFAULT NULL,
  `Total` float DEFAULT NULL,
  PRIMARY KEY (`ID_Venta`),
  KEY `ID_Empleado` (`ID_Empleado`,`ID_Cliente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla ecobordado.venta: ~5 rows (aproximadamente)
REPLACE INTO `venta` (`ID_Venta`, `Fecha`, `ID_Cliente`, `ID_Empleado`, `Total`) VALUES
	(1, '2026-07-23', 1, 3, 80000),
	(2, '2026-07-23', 2, 3, 45000),
	(3, '2026-07-23', 1, 3, 160000),
	(4, '2026-07-23', 2, 3, 15000),
	(5, '2026-07-23', 3, 3, 25000);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
