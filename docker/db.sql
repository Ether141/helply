--
-- TOC entry 3480 (class 0 OID 16413)
-- Dependencies: 221
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: appuser
--

COPY public."Users" ("Id", "Email", "PasswordHash", "LastName", "Role", "FirstName") FROM stdin;
012e9883-239c-48f6-910a-5422c0a9df63	piotrnowak@gmail.com	AQAAAAIAAYagAAAAEAZ+OO+huVlR87mUWTGEIMqkB6L5OLSekYJyToYqe+ChL4y4GaBFgmCiZ+urKxr/LQ==	Nowak	0	Piotr
42eceb32-4ecb-4919-8033-d84a5e33234d	jankowalski@gmail.com	AQAAAAIAAYagAAAAED92lh8Oee7e3XCWKHWsR/gbwan5/A6BvRoQA025gMZiAB1PzWOznruyRL4ydB4pJA==	Kowalski	1	Jan
cead4604-3355-4489-8558-f347f88f16cc	monikalewandowska@gmail.com	AQAAAAIAAYagAAAAEMsiOkiJKWmokN8c3rkItGuTTsPUbXCYxEr58UHaBl5iWndNL3fcr2UrnVzDX7zMdA==	Lewandowska	1	Monika
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
\.

SELECT setval('"Tickets_Slug_seq"', 6, true);