--
-- TOC entry 3480 (class 0 OID 16413)
-- Dependencies: 221
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: appuser
--

COPY public."Users" ("Id", "Email", "PasswordHash", "LastName", "Role", "FirstName") FROM stdin;
012e9883-239c-48f6-910a-5422c0a9df63	piotrnowak@gmail.com	AQAAAAIAAYagAAAAEAZ+OO+huVlR87mUWTGEIMqkB6L5OLSekYJyToYqe+ChL4y4GaBFgmCiZ+urKxr/LQ==	Nowak	0	Piotr
42eceb32-4ecb-4919-8033-d84a5e33234d	jankowalski@gmail.com	AQAAAAIAAYagAAAAED92lh8Oee7e3XCWKHWsR/gbwan5/A6BvRoQA025gMZiAB1PzWOznruyRL4ydB4pJA==	Kowalski	1	Jan
cead4604-3355-4489-8558-f347f88f16cc	monikalewandowska@gmail.com	AQAAAAIAAYagAAAAEMsiOkiJKWmokN8c3rkItGuTTsPUbXCYxEr58UHaBl5iWndNL3fcr2UrnVzDX7zMdA==	Lewandowska	1	Monika
f6a1f4e7-3f8a-4c42-8c44-7a1e3b4a0d25	annamaj@gmail.com	AQAAAAIAAYagAAAAEAZ+OO+huVlR87mUWTGEIMqkB6L5OLSekYJyToYqe+ChL4y4GaBFgmCiZ+urKxr/LQ==	Maj	0	Anna
0b4bba7d-9a5b-4e0b-8f1e-6b1fb3c6d1a8	michalzielinski@gmail.com	AQAAAAIAAYagAAAAEAZ+OO+huVlR87mUWTGEIMqkB6L5OLSekYJyToYqe+ChL4y4GaBFgmCiZ+urKxr/LQ==	Zieliński	0	Michał
\.

--
-- TOC entry 3477 (class 0 OID 16398)
-- Dependencies: 218
-- Data for Name: TicketCategories; Type: TABLE DATA; Schema: public; Owner: appuser
--

COPY public."TicketCategories" ("Id", "Name", "Description") FROM stdin;
1b4f3a2e-2c6e-4a9f-8f1a-3f9b1c2d7e4a	Dostępy i uprawnienia (IAM)	Nadawanie/zmiana/odbieranie dostępów do narzędzi i zasobów (VPN, SSO, chmura, klastry, repozytoria, rejestry). Reset MFA/hasła, role, grupy i audyt uprawnień.
7c2d9a10-5d8f-4f2b-9a3e-0b1c2d3e4f5a	Repozytoria i kontrola wersji	Problemy i prośby dot. Git/repozytoriów (tworzenie projektów, uprawnienia, branch protection, merge policies, LFS), webhooki, integracje, utrata dostępu, porządki w repo.
2f8c1d3e-9b6a-4d5c-8e7f-1a2b3c4d5e6f	CI/CD i pipeline’y	Konfiguracja i awarie pipeline’ów (build/test/release), runnerzy/agenci, sekrety, cache, artefakty, wersjonowanie, harmonogramy, optymalizacja czasu i stabilności jobów.
9a7e6d5c-4b3a-4c2d-8e1f-0a9b8c7d6e5f	Deployment i wydania	Wsparcie przy wdrożeniach (deploy/rollback), strategie (blue-green/canary), tagowanie release’ów, okna wdrożeniowe, koordynacja oraz problemy z rolloutem na środowiskach.
3d2c1b0a-7e6f-4a5b-9c8d-1e2f3a4b5c6d	Środowiska (DEV/TEST/UAT)	Zakładanie, odtwarzanie i konfiguracja środowisk. Zmienne środowiskowe, konfiguracje usług, seed danych, dostępność, diagnoza problemów specyficznych dla środowiska.
a1c2d3e4-5f60-4a7b-8c9d-0e1f2a3b4c5d	Kubernetes / kontenery	Klastry K8s i kontenery: namespace’y, RBAC, ingress, limity zasobów, problemy z podami, rejestry obrazów, Helm/Kustomize, konfiguracja i troubleshooting.
f0e1d2c3-b4a5-4c6d-8e9f-1a2b3c4d5e6a	Chmura i zasoby (IaaS/PaaS)	Provisioning i utrzymanie zasobów chmurowych (VM, sieci, storage, bazy, load balancery). Quoty, koszty, polityki, tagging, automatyzacja (Terraform).
6e5d4c3b-2a1f-4e0d-9c8b-7a6f5e4d3c2b	Sekrety, certyfikaty i konfiguracja	Zarządzanie sekretami (Vault/Secrets Manager), rotacja kluczy, certyfikaty TLS, konfiguracja SSO/OIDC, odnowienia, wycieki sekretów, standardy przechowywania i dostępu.
\.


--
-- TOC entry 3479 (class 0 OID 16408)
-- Dependencies: 220
-- Data for Name: Tickets; Type: TABLE DATA; Schema: public; Owner: appuser
--

COPY public."Tickets" ("Id", "Slug", "Title", "Description", "Status", "Priority", "CreatedAt", "UpdatedAt", "UserId", "AssistantId", "TicketCategoryId") FROM stdin;
4f93920e-09d9-4d58-85da-21f3f6384970	5	Wygasł mi dostęp do VPN / nie mogę połączyć się z siecią firmową	Nie mogę połączyć się z VPN (błąd …) i przez to nie mam dostępu do środowisk/testów/klastrów. Używam klienta …, system …, ostatnio działało … (data/godzina). Próbowałem restartu, ponownej instalacji i logowania przez SSO/MFA. Proszę o sprawdzenie mojego konta i przywrócenie dostępu.	0	1	2026-01-07 22:20:27.604654+00	2026-01-07 22:20:27.604654+00	012e9883-239c-48f6-910a-5422c0a9df63	\N	f0e1d2c3-b4a5-4c6d-8e9f-1a2b3c4d5e6a
f42650a0-97ec-49dc-a1f1-890ac677f914	2	Nie mogę zrobić push do repozytorium (permission denied)	Od dziś nie mogę wypchnąć zmian do repo. Przy próbie git push dostaję błąd „permission denied”/„403”. Repo: …, mój login: …. Problem występuje na (HTTPS/SSH). Jeśli SSH: mój publiczny klucz ma fingerprint …. Potrzebuję przywrócenia uprawnień do zapisu.	1	1	2025-12-25 10:45:00.934626+00	2026-01-07 22:25:09.174562+00	012e9883-239c-48f6-910a-5422c0a9df63	42eceb32-4ecb-4919-8033-d84a5e33234d	7c2d9a10-5d8f-4f2b-9a3e-0b1c2d3e4f5a
6fb07f38-4c4b-479a-86bc-6055dcb948b9	0	Prośba o dostęp do repozytorium GitHub	Jestem nowym pracownikiem i potrzebuję dostępu do repozytorium aplikacji AppX na GitHubie.	2	3	2026-12-21 20:15:40.504498+00	2026-01-07 22:25:31.823751+00	012e9883-239c-48f6-910a-5422c0a9df63	42eceb32-4ecb-4919-8033-d84a5e33234d	7c2d9a10-5d8f-4f2b-9a3e-0b1c2d3e4f5a
f0e034d1-5965-495f-b046-dc6d40a0838e	4	Deploy na DEV nie dochodzi do skutku — aplikacja nie wstaje	Wdrożenie wersji … na środowisko DEV nie przechodzi: rollout stoi albo pody wpadają w CrashLoopBackOff/brak readiness. Usługa: …, namespace/projekt: …, czas ostatniej próby: …. Dołączam logi z poda i wynik kubectl describe pod …. Potrzebuję, żeby środowisko wróciło do działania lub żebym dostał instrukcję co poprawić.	3	2	2026-01-04 12:50:10.779149+00	2026-01-07 22:26:52.195998+00	012e9883-239c-48f6-910a-5422c0a9df63	cead4604-3355-4489-8558-f347f88f16cc	3d2c1b0a-7e6f-4a5b-9c8d-1e2f3a4b5c6d
2d80da5b-4d3d-4353-8b53-c366ed78e89a	3	Pipeline w CI/CD ciągle failuje po moim merge (build/test)	Po zmergowaniu MR/PR … pipeline na gałęzi … nie przechodzi. Pada na jobie … z błędem … (wkleiłem fragment logów). Lokalnie testy/build przechodzą. Proszę o pomoc w diagnozie (runner, cache, zależności, konfiguracja joba).	0	0	2026-01-01 18:18:38.480718+00	2026-01-01 18:18:38.480718+00	012e9883-239c-48f6-910a-5422c0a9df63	\N	2f8c1d3e-9b6a-4d5c-8e7f-1a2b3c4d5e6f
38ebcb91-b9f0-40d5-aa33-b7529fa88713	1	Odświeżenie certyfikatu SSL	Certyfikat SSL dla naszej aplikacji internetowej AppX wygasł 28 grudnia 2025. Potrzebujemy go odnowić.	4	2	2026-12-20 11:11:45.953324+00	2026-01-07 22:29:00.848919+00	012e9883-239c-48f6-910a-5422c0a9df63	cead4604-3355-4489-8558-f347f88f16cc	6e5d4c3b-2a1f-4e0d-9c8b-7a6f5e4d3c2b
9b5e1e32-3e57-45b1-8c07-ef60a65a2c11	6	Nie działa logowanie do VPN po zmianie telefonu (MFA)	Po wymianie telefonu i reinstalacji aplikacji MFA nie mogę przejść logowania do VPN (błąd „invalid token”). Proszę o reset/ponowną rejestrację MFA dla mojego konta oraz instrukcję, jak poprawnie skonfigurować dostęp.	4	1	2026-01-21 08:12:10.101000+00	2026-01-21 09:40:30.000000+00	f6a1f4e7-3f8a-4c42-8c44-7a1e3b4a0d25	cead4604-3355-4489-8558-f347f88f16cc	f0e1d2c3-b4a5-4c6d-8e9f-1a2b3c4d5e6a
1c2b0c5a-9b38-4f7d-8d2c-1d7e6d8d1e0a	7	Pipeline failuje na stage test — różne wersje Node	Po merge pipeline w CI/CD pada na testach z błędem dot. wersji Node/npm. Lokalnie używam Node 20, na runnerze wygląda jakby było 18. Proszę o wskazanie jak ustawić spójną wersję (nvm/.tool-versions) i poprawić cache.	4	1	2026-01-21 10:30:45.551000+00	2026-01-21 12:50:30.000000+00	f6a1f4e7-3f8a-4c42-8c44-7a1e3b4a0d25	42eceb32-4ecb-4919-8033-d84a5e33234d	2f8c1d3e-9b6a-4d5c-8e7f-1a2b3c4d5e6f
6e4a5d9e-4a0f-49b9-8f84-49df9a6f5c2f	8	Prośba o dostęp do namespace w Kubernetes	Potrzebuję dostępu do namespace „team-a-dev” w klastrze oraz roli umożliwiającej podgląd logów i deploy (bez uprawnień admin). Proszę o nadanie RBAC i wskazanie, czy wymagane jest zatwierdzenie przez PM.	4	2	2026-01-22 09:05:20.777000+00	2026-01-22 10:03:15.000000+00	f6a1f4e7-3f8a-4c42-8c44-7a1e3b4a0d25	cead4604-3355-4489-8558-f347f88f16cc	a1c2d3e4-5f60-4a7b-8c9d-0e1f2a3b4c5d
3d0a5f7d-7c49-4b5e-9c2a-1f2f8b4d1b7a	9	Nie mam uprawnień do projektu w GitLab	Po dołączeniu do zespołu nie widzę projektu „platform-api” w GitLabie (404). Proszę o dodanie mnie do grupy i nadanie roli Developer. Mój email w GitLab: michalzielinski@gmail.com.	1	1	2026-01-20 15:40:02.044000+00	2026-01-20 16:06:10.000000+00	0b4bba7d-9a5b-4e0b-8f1e-6b1fb3c6d1a8	42eceb32-4ecb-4919-8033-d84a5e33234d	7c2d9a10-5d8f-4f2b-9a3e-0b1c2d3e4f5a
8b4f3d2c-6f1e-4a12-8a87-63c2c3f8d0b1	10	Wygasł certyfikat TLS na środowisku TEST	Dostajemy błędy przeglądarki o nieważnym certyfikacie na środowisku TEST. Proszę o weryfikację łańcucha i odnowienie certyfikatu (jeśli to Let’s Encrypt, możliwe że cron/renew nie zadziałał).	2	2	2026-01-21 19:22:15.330000+00	2026-01-22 08:06:05.000000+00	0b4bba7d-9a5b-4e0b-8f1e-6b1fb3c6d1a8	cead4604-3355-4489-8558-f347f88f16cc	6e5d4c3b-2a1f-4e0d-9c8b-7a6f5e4d3c2b
0f2c1b8a-4a4c-4c9c-8b14-5d6f7a8b9c0d	11	Brak dostępu do secrets w Vault	Aplikacja nie startuje, bo nie może pobrać sekretów z Vault (permission denied). Potrzebuję, żeby ktoś zweryfikował policy/role dla mojego serwisu oraz czy tokeny nie wygasły.	3	2	2026-01-22 11:55:09.612000+00	2026-01-22 13:12:40.000000+00	0b4bba7d-9a5b-4e0b-8f1e-6b1fb3c6d1a8	cead4604-3355-4489-8558-f347f88f16cc	6e5d4c3b-2a1f-4e0d-9c8b-7a6f5e4d3c2b
\.


--
-- TOC entry 3478 (class 0 OID 16403)
-- Dependencies: 219
-- Data for Name: TicketComments; Type: TABLE DATA; Schema: public; Owner: appuser
--

COPY public."TicketComments" ("Id", "TicketId", "Content", "AuthorId", "CreatedAt") FROM stdin;
dbd86056-a687-475f-9d65-7918897680f7	6fb07f38-4c4b-479a-86bc-6055dcb948b9	Będziemy potrzebować approve od Twojego project managera.	42eceb32-4ecb-4919-8033-d84a5e33234d	2026-01-07 22:25:31.818522+00
f15df8c8-9de2-4752-ae73-82fd3d2c1d1e	f0e034d1-5965-495f-b046-dc6d40a0838e	Czekamy na odpowiedź od zewnętrznego zespołu.	cead4604-3355-4489-8558-f347f88f16cc	2026-01-07 22:26:52.195836+00
40e17d62-0e89-4fb1-be42-2efba335be4a	38ebcb91-b9f0-40d5-aa33-b7529fa88713	Certyfikat został odświeżony do 1 stycznia 2027 roku. Proszę o potwierdzenie, czy teraz już wszystko jest w porządku po Waszej stronie.	cead4604-3355-4489-8558-f347f88f16cc	2026-01-07 22:27:39.07162+00
7f4e3a29-f742-4084-9504-69fd4d468fa2	38ebcb91-b9f0-40d5-aa33-b7529fa88713	Potwierdzam. Certyfikat został odnowiony. Można zamknąć zgłoszenie.	012e9883-239c-48f6-910a-5422c0a9df63	2026-01-07 22:29:00.848839+00
a4f6a6e2-1d7a-4e66-9b5f-ef9c6b2f4e11	9b5e1e32-3e57-45b1-8c07-ef60a65a2c11	Dla jasności: korzystam z FortiClient, a problem pojawił się po przeniesieniu MFA na nowy telefon. Próbowałam usunąć i dodać konto MFA, ale nadal odrzuca kod.	f6a1f4e7-3f8a-4c42-8c44-7a1e3b4a0d25	2026-01-21 08:20:34.210000+00
b6b1f1a4-6f3c-4a0e-9a0c-2f6d1b3a9c12	9b5e1e32-3e57-45b1-8c07-ef60a65a2c11	Dzięki za szczegóły. Zresetuję rejestrację MFA dla Twojego konta. Po resecie zaloguj się do SSO i ponownie dodaj urządzenie, a potem spróbuj połączenia VPN.	cead4604-3355-4489-8558-f347f88f16cc	2026-01-21 09:05:11.900000+00
c2a8b9f0-5b1c-4f4b-8a7e-8c4d1a2b3c13	1c2b0c5a-9b38-4f7d-8d2c-1d7e6d8d1e0a	W logu z joba mam: "Node version 18.x is not supported". Repo ma już ustawione "engines": "node": ">=20".	f6a1f4e7-3f8a-4c42-8c44-7a1e3b4a0d25	2026-01-21 10:35:19.440000+00
d1e2f3a4-b5c6-4d7e-8f90-1a2b3c4d5e14	1c2b0c5a-9b38-4f7d-8d2c-1d7e6d8d1e0a	Wygląda na niespójny runner. Proponuję dodać pin wersji (np. `.nvmrc` albo `.tool-versions`) i w pipeline jawnie ustawić Node 20. Po tym wyczyśćmy cache dla joba test.	42eceb32-4ecb-4919-8033-d84a5e33234d	2026-01-21 11:00:02.005000+00
e9c1b2a3-4d5e-4f60-8a7b-9c0d1e2f3a15	6e4a5d9e-4a0f-49b9-8f84-49df9a6f5c2f	Czy masz już zatwierdzenie od PM/Ownera namespace? Jeśli tak, podeślij nazwę grupy/zespołu i preferowaną rolę (view/deploy).	cead4604-3355-4489-8558-f347f88f16cc	2026-01-22 09:10:04.300000+00
f0a1b2c3-d4e5-4a6b-8c7d-9e0f1a2b3c16	6e4a5d9e-4a0f-49b9-8f84-49df9a6f5c2f	Tak, mam zgodę od PM. Proszę o RBAC: podgląd logów + możliwość deploy w `team-a-dev` (bez admin). Grupa: team-a.	f6a1f4e7-3f8a-4c42-8c44-7a1e3b4a0d25	2026-01-22 09:26:41.120000+00
0a1b2c3d-4e5f-4a6b-8c7d-9e0f1a2b3c17	3d0a5f7d-7c49-4b5e-9c2a-1f2f8b4d1b7a	Dodałem Cię do grupy projektu i nadałem rolę Developer. Sprawdź proszę, czy projekt jest już widoczny i czy możesz robić push/merge request.	42eceb32-4ecb-4919-8033-d84a5e33234d	2026-01-20 15:55:28.800000+00
1b2c3d4e-5f60-4a7b-8c9d-0e1f2a3b4c18	3d0a5f7d-7c49-4b5e-9c2a-1f2f8b4d1b7a	Potwierdzam, projekt już widzę i mogę wypchnąć zmiany. Dzięki!	0b4bba7d-9a5b-4e0b-8f1e-6b1fb3c6d1a8	2026-01-20 16:05:03.950000+00
2c3d4e5f-6071-4b82-9c1d-1e2f3a4b5c19	8b4f3d2c-6f1e-4a12-8a87-63c2c3f8d0b1	Podeślij proszę dokładny hostname (FQDN) środowiska TEST oraz czy to cert z Let’s Encrypt czy wewnętrzny. Sprawdzę też, czy renew job nie stoi.	cead4604-3355-4489-8558-f347f88f16cc	2026-01-21 19:35:47.500000+00
3d4e5f60-7182-4c93-ad2e-2f3a4b5c6d20	8b4f3d2c-6f1e-4a12-8a87-63c2c3f8d0b1	Hostname: test.appx.company.local. Wygląda na Let’s Encrypt, ostatnio odnawialiśmy automatem.	0b4bba7d-9a5b-4e0b-8f1e-6b1fb3c6d1a8	2026-01-21 19:50:12.110000+00
4e5f6071-8293-4da4-be3f-3a4b5c6d7e21	0f2c1b8a-4a4c-4c9c-8b14-5d6f7a8b9c0d	Czy możesz podać nazwę roli/policy w Vault oraz ścieżkę sekretów, do której próbujecie się dobrać? To pomoże szybko zweryfikować, czy to kwestia policy czy wygasłego tokena.	cead4604-3355-4489-8558-f347f88f16cc	2026-01-22 12:05:33.400000+00
5f607182-9394-4eb5-cf40-4b5c6d7e8f22	0f2c1b8a-4a4c-4c9c-8b14-5d6f7a8b9c0d	Policy/rola: appx-dev-read, ścieżka: secret/data/appx/dev. Token jest wstrzykiwany przez CI.	0b4bba7d-9a5b-4e0b-8f1e-6b1fb3c6d1a8	2026-01-22 12:20:09.020000+00
6a718293-a4b5-4fc6-8d70-5c6d7e8f9a23	3d0a5f7d-7c49-4b5e-9c2a-1f2f8b4d1b7a	Super, dzięki za potwierdzenie. Zamykam zgłoszenie.	42eceb32-4ecb-4919-8033-d84a5e33234d	2026-01-20 16:06:10.000000+00
7b8293a4-b5c6-40d7-9e81-6d7e8f9a0b24	9b5e1e32-3e57-45b1-8c07-ef60a65a2c11	Po resecie i ponownym dodaniu MFA już działa — VPN łączy się poprawnie. Dzięki!	f6a1f4e7-3f8a-4c42-8c44-7a1e3b4a0d25	2026-01-21 09:38:12.500000+00
8c93a4b5-c6d7-41e8-8f92-7e8f9a0b1c25	9b5e1e32-3e57-45b1-8c07-ef60a65a2c11	Świetnie, w takim razie zamykam zgłoszenie. Gdyby problem wrócił, daj znać.	cead4604-3355-4489-8558-f347f88f16cc	2026-01-21 09:40:30.000000+00
9d0a1b2c-3d4e-42f0-9a03-8f9a0b1c2d26	1c2b0c5a-9b38-4f7d-8d2c-1d7e6d8d1e0a	Dodałam `.nvmrc` (20) i wymusiłam wersję w pipeline. Po wyczyszczeniu cache job test przeszedł i pipeline jest zielony.	f6a1f4e7-3f8a-4c42-8c44-7a1e3b4a0d25	2026-01-21 12:45:10.000000+00
ae1b2c3d-4e5f-4301-8b14-9a0b1c2d3e27	1c2b0c5a-9b38-4f7d-8d2c-1d7e6d8d1e0a	Super. Widzę, że ostatnie przebiegi są OK. Zamykam zgłoszenie.	42eceb32-4ecb-4919-8033-d84a5e33234d	2026-01-21 12:50:30.000000+00
\.

SELECT setval('"Tickets_Slug_seq"', 11, true);