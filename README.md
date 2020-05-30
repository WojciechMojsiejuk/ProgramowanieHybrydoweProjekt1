# ProgramowanieHybrydoweProjekt1

## Programowanie Hybrydowe – Projekt numer 1
### Cel projektu:
Celem  pierwszego  projektu  zespołowego,  który  realizują  Państwo  w  ramach  przedmiotu Programowanie  Hybrydowe  jest  opracowanie  API biblioteki z  wykorzystaniem  technologii  Spring  Boot,  a następnie wdrożenie w ramach platformy chmurowej (np.Microsoft Azure) i wykazanie, że dana implementacja działa w sposób oczekiwany poprzez połączenie z poziomu innej aplikacji.Funkcjonalności, które powinni Państwo zaimplementować są następujące:
 - Wyświetlenie wszystkich książek znajdujących się w bibliotece (model książki powinien składać się przynajmniej z trzech pól: autorów, tytułu oraz roku wydania)
 - Dodanienowej książki
 - Usunięcie dotychczas istniejącej książki
 - Wypożyczenie książki przez użytkownika (nałożenie obostrzenia mówiącego o tym, że jeżeli książka jest wypożyczona, nie powinna istnieć możliwość ponownego jej wypożyczenia)
 - Zwrócenie książki
 - Wyszukiwanie książek po tytule, roku wydania lub autorach
 - Rola  administracyjna  (proszę  uwzględnić,  że  w  systemie  powinien  istnieć przynajmniej jeden administrator):
     - Dodawanie nowych użytkowników (login oraz przynajmniej generowanie hasła)
     - Usuwanie użytkowników
     - Wyszukiwanie użytkowników po ich nazwie
- Ponadto, proszę w odpowiedni sposób zabezpieczyć API na ocenę dobrą wystarczy zastosowanie mechanizmu sesjioraz tradycyjnego loginu i hasła, natomiast w przypadku oceny bardzo dobrej, login z użyciem konta Google jak również zastosowanie mechanizmu JSON Web Token.
