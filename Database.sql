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
	rzadkosc VARCHAR(30) NOT NULL CHECK(rzadkosc = 'uncommon' OR rzadkosc = 'common' OR rzadkosc = 'rare' OR rzadkosc = 'epic' OR rzadkosc = 'legendary')
)

INSERT INTO Uzytkownicy VALUES
('Admin', 1000, 'Adam', 'Czyz', 'Adam@rynek.com', 'root1234'),
('Milos', 420, 'Miłosz', 'Pietrzak','Milos@rynek.com', 'password'),
('Olsson_PL', 35, 'Oliwier', 'Bernatowicz', 'Polskagurom@gmail.pl', 'BugHonorOjczyzna')


INSERT INTO gry VALUES
('Crab Game'),
('Clash Royale'),
('Whos your daddy?')

INSERT INTO przedmioty VALUES
('Golden Sandals', 'Adam@rynek.com', 'Crab Game','epic' ),
('X-BOW', 'Polskagurom@gmail.pl', 'Clash Royale', 'epic'),
('Your mom', 'Milos@rynek.com', 'Whos your daddy?','legendary')


select * from gry
select * from przedmioty
select * from uzytkownicy
