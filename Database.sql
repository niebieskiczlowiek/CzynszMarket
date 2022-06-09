USE master
GO

DROP DATABASE IF EXISTS RYNEK
GO

CREATE DATABASE RYNEK
GO

USE RYNEK
GO

CREATE TABLE Gry(
	Tytul VARCHAR(50) NOT NULL PRIMARY KEY 
)

CREATE TABLE Uzytkownicy(
	Nazwa_Uzytkownika VARCHAR(50) NOT NULL,
	Saldo MONEY,
	Imie VARCHAR(50) NOT NULL CHECK(len(Imie) >= 3),
	Nazwisko VARCHAR(50) NOT NULL CHECK(len(Nazwisko) >= 3),
	Email VARCHAR(50) NOT NULL PRIMARY KEY,
	Haslo VARCHAR(50) NOT NULL CHECK(len(Haslo) >= 8)
)

CREATE TABLE Oferty(
	Data_Wystawienia DATE NOT NULL,
	Data_Waznosci DATE NOT NULL,
	Status VARCHAR(20) CHECK(Status LIKE 'Dostepny' OR Status LIKE 'Nie Dostepny')
)

CREATE TABLE Przedmioty(
	Nazwa_Przedmiotu VARCHAR(50) NOT NULL CHECK(len(Nazwa_Przedmiotu) >= 5),
	Id_Przedmiotu INT NOT NULL PRIMARY KEY IDENTITY,
	Email_uzytkownika VARCHAR(50) NOT NULL REFERENCES Uzytkownicy(Email),
	Gra VARCHAR(50) NOT NULL REFERENCES Gry(Tytul),
	rzadkosc VARCHAR(30) NOT NULL CHECK(rzadkosc = 'uncommon' OR rzadkosc = 'common' OR rzadkosc = 'rare' OR rzadkosc = 'epic' OR rzadkosc = 'legendary'),
	oferta VARCHAR(30) NOT NULL CHECK(oferta = 'toSell' OR oferta = 'notToSell'),
	cena MONEY
)

INSERT INTO Uzytkownicy VALUES
('Admin', 1000, 'Adam', 'Czyz', 'Adam@rynek.com', 'root1234'),
('Milos', 420, 'Miłosz', 'Pietrzak','Milos@rynek.com', 'password'),
('Olsson_PL', 35, 'Oliwier', 'Bernatowicz', 'Polskagurom@gmail.pl', 'BugHonorOjczyzna')


INSERT INTO gry VALUES
('Crab Game'),
('Clash Royale'),
('Whos your daddy?'),
('Celeste'),
('CS:GO'),
('Dont Starve Together'),
('Grand Theft Auto V'),
('LEGO StarWars'),
('SUPERHOT VR'),
('Team Fortress 2'),
('Terraria'),
('Undertale'),
('Red Dead Redemption 2')

INSERT INTO przedmioty VALUES
('Golden Sandals', 'Adam@rynek.com', 'Crab Game','epic', 'toSell', 5),
('X-BOW', 'Polskagurom@gmail.pl', 'Clash Royale', 'epic', 'toSell',  10),
('Your mom', 'Milos@rynek.com', 'Whos your daddy?','legendary','notToSell', 0.5),
('PP-Bizon | Facility Sketch', 'Adam@rynek.com', 'CS:GO', 'common', 'toSell', 2),
('The Zenith', 'Adam@rynek.com', 'Terraria', 'legendary', 'notToSell', 15),
('Sweater Vest', 'Milos@rynek.com', 'Dont Starve Together', 'rare', 'toSell', '6' )


--cena jest w czynsz coinach -> 1 CzynszCoin = 6.9 zł

USE RYNEK
GO

select * from gry
select * from przedmioty
select * from uzytkownicy
