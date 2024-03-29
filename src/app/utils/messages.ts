export const MESSAGE = {
  //REQUIRED
  requiredField: 'Obavezno polje!',
  required: 'Obavezno polje!',

  //SUCCESS
  success_delete: 'Uspešno obrisano!',
  success_post: 'Uspešno postavljeno!',
  success_put: 'Uspešno izmenjeno!',
  success_password_change: 'Lozinka je uspešno promenjena!',
  success_activation_plan: 'Uspešno aktiviran plan!',
  success_duplicate_plan: 'Uspešno dupliran plan!',
  success_upload: 'Planovi su uspešno učitani',
  success_post_plan: 'Plan je uspešno postavljen!',
  success_put_plan: 'Plan je uspešno izmenjen!',
  success_valid_plan: 'Plan je validan!',
  success_cache_clear: 'Cache je uspešno obrisan!',
  reset_success: 'Uspešno resetovano!',
  cancel_success: 'Uspešno otkazano!',
  success_operator: 'Operator uspešno postavljen!',
  success_shortening: 'Uspešno skraćena ruta!',
  success_message: 'Uspešno postavljena poruka!',
  success_update_app_param: 'Parametar aplikacije je uspešno izmenjen!',
  success_audio_controller_update: 'Audio kontroler uspešno izmenjen.',

  //IN PROGRESS
  duplicate_plan_in_progress: 'Zahtev za dupliranje plana u toku...',
  cut_plan_in_progress: 'Zahtev za ograničavanje plana u toku...',
  cut_plan_success: 'Plan uspešno ograničen!',
  activation_in_progress: 'Zahtev za aktivaciju plana u toku...',
  activation_plan_sent: 'Zahtev za aktivaciju plana poslan.',
  upload_in_progress: 'Zahtev za učitavanje plana u toku...',

  //ERRORS:
  NO_CONNECTION: 'Nema konekcije!',
  RUNTIME_ERROR: 'Došlo je do greške!',
  VALIDATION_ERROR: 'Došlo je do greške! Proverite podatke!',
  NOT_ENOUGH_LICENSES: 'Nemate dovoljno licenci!',
  SERVER_ERROR: 'Došlo je do greške. Pokušajte ponovo.',
  NOT_VALID: 'Nevalidni ulazni podaci',
  UNKNOWN_EXCEPTION: 'Podaci nisu ispravni!',
  BAD_CREDENTIALS: 'Uneti podaci nisu ispravni!',
  USER_NOT_FOUND: 'Nepostojeći korisnik!',
  USER_IS_LOCKED: 'Korisnik je zaključan!',
  error_upload_plan: 'Došlo je do greške prilikom učitavanja datoteke!',
  error_cut_plan: 'Došlo je do greške prilikom ograničavanja plana!',
  error_login: 'Greška prilikom logovanja!',
  error_interval_save: 'Došlo je do greške prilikom čuvanja novog planskog intervala!',
  error_interval_edit: 'Došlo je do greške prilikom ažuriranja planskog intervala!',
  error_interval_search: 'Došlo je do greške prilikom pretrage planskog intervala!',
  error_station_save: 'Došlo je do greške prilikom čuvanja nove stanice!',
  error_station_edit: 'Došlo je do greške prilikom ažuriranja stanice!',
  error_station_search: 'Došlo je do greške prilikom pretrage stanice!',
  error_station_input: 'Došlo je do greške prilikom unosa podataka! Unesite smislene podatke!',
  error_train_save: 'Došlo je do greške prilikom čuvanja novog voza!',
  error_train_update: 'Došlo je do greške prilikom ažuriranja voza!',
  error_train_search: 'Došlo je do greške prilikom pretrage voza!',
  error_train_input: 'Došlo je do greške prilikom unosa podataka! Unesite smislene podatke!',
  error_weekly_schedule_delete: 'Došlo je do greške prilikom brisanja nedeljnog rasporeda!',
  error_interval_delete: 'Došlo je do greške prilikom brisanja planskog intervala!',
  error_weekly_schedule_edit: 'Došlo je do greške prilikom ažuriranja nedeljnog rasporeda!',
  error_weekly_schedule_save: 'Došlo je do greške prilikom čuvanja nedeljnog rasporeda!',
  error_train_delete: 'Došlo je do greške prilikom brisanja voza!',
  error_station_delete: 'Došlo je do greške prilikom brisanja stanice!',
  error_station_get: 'Došlo je do greške prilikom prikaza stanica!',
  error_password_change: 'Lozinka mora biti ista za oba unosa!',
  error_password_change_empty_fields: 'Sva polja moraju biti popunjena!',
  error_password_default: 'Došlo je do greške prilikom promene lozinke!',
  error_special_day_search: 'Došlo je do greške prilikom pretrage specijalnog dana!',
  error_special_day_delete: 'Došlo je do greške prilikom brisanja specijalnog dana!',
  error_special_day_update: 'Došlo je do greške prilikom ažuriranja specijalnog dana!',
  error_special_day_save: 'Došlo je do greške prilikom čuvanja specijalnog dana!',
  error_special_day_input: 'Došlo je do greške prilikom unosa podataka! Unesite smislene podatke!',
  error_tracks_load: 'Došlo je do greške prilikom učitavanja koloseka!',
  error_tracks_save: 'Došlo je do greške prilikom dodavanja koloseka!',
  error_subsequent_station_load: 'Došlo je do greške prilikom učitavanja susednih stanica!',
  error_subsequent_station_delete: 'Došlo je do greške prilikom brisanja susednih stanica!',
  error_subsequent_station_edit: 'Došlo je do greške prilikom ažuriranja susednih stanica!',
  error_subsequent_station_input: 'Došlo je do greške prilikom unosa podataka! Izaberite stanicu za dodavanje!',
  error_activating_plan: 'Došlo je do greške prilikom aktivacije plana',
  error_premises_station_load: 'Došlo je do greške prilikom učitavanja prostorija!',
  error_premises_station_delete: 'Došlo je do greške prilikom brisanja prostorija!',
  error_premises_station_edit: 'Došlo je do greške prilikom ažuriranja prostorija!',
  error_premises_station_input: 'Došlo je do greške prilikom unosa podataka! Izaberite tip prostorije i unesite naziv!',
  error_route_save: 'Došlo je do greške prilikom čuvanja nove rute!',
  error_route_update: 'Došlo je do greške prilikom ažuriranja rute!',
  error_route_input: 'Došlo je do greške prilikom unosa podataka! Izaberite stanicu(e) i unesite naziv!',
  error_plan_details_load: 'Došlo je do greške prilikom učitavanja detalja plana!',
  error_plan_post: 'Došlo je do greške prilikom unosa novog plana!',
  error_plan_put: 'Došlo je do greške prilikom ažuriranja plana!',
  error_plan_delete: 'Došlo je do greške prilikom brisanja plana!',
  error_user_input: 'Došlo je do greške prilikom unosa podataka! Popunite sva polja!',
  error_interval_plan_input: 'Došlo je do greške prilikom unosa podataka! Popunite sva polja!',
  error_weekly_schedule_input: 'Došlo je do greške prilikom unosa podataka! Unesite sva obavezna polja!',
  error_user_edit: 'Došlo je do greške prilikom ažuriranja korisnika!',
  error_user_save: 'Došlo je do greške prilikom čuvanja novog korisnika!',
  error_user_role_save: 'Došlo je do greške prilikom dodavanja korisničnih rola!',
  error_user_role_load: 'Došlo je do greške prilikom učitavanja korisničkih rola!',
  error_user_stations_load: 'Došlo je do greške prilikom učitavanja stanica korisnika!',
  error_user_stations_save: 'Došlo je do greške prilikom čuvanja stanice korisnika!',
  error_user_stations_delete: 'Došlo je do greške prilikom brisanja stanice korisnika!',
  error_user_station_input: 'Došlo je do greške prilikom unosa podataka! Izaberite stanicu za dodavanje!',
  error_plan_input: 'Došlo je do greške prilikom unosa podataka! Unesite sva obavezna polja!',
  error_duplicate_plan: 'Došlo je do greške prilikom dupliranja planova!',
  error_jobs: 'Došlo je do greške prilikom učitavanja planova!',
  route_editable_error: 'Ruta se ne može menjati ili brisati, postoje planovi za tu rutu!',
  plan_editable_error: 'Plan se ne može menjati ili brisati!',
  plan_interval_editable_error: 'Interval plana se ne može menjati ili brisati, postoje planovi za taj interval!',
  error_station_is_for_delete: 'Stanica se ne može brisati, postoje rute za tu stanicu!',
  plan_validate_error: 'Plan nije validan!',
  weekly_schedule_editable_error:
    'Nedeljni raspored se ne može menjati ili brisati, postoje planovi za taj nedeljni raspored!',
  error_train_is_for_delete: 'Voz se ne može brisati, postoje planovi za taj voz!',
  error_plan_is_for_cut: 'Plan je već ograničen!',
  error_plan_is_for_activate: 'Plan nije moguće aktivirati!',
  error_cache_clear: 'Došlo je do greške prilikom brisanja cache-a!',
  WEEK_SCHEDULE_ALREADY_EXISTS: 'Nedeljni raspored za odabrane dane i odabran specijalni dan već postoji!',
  SESSION_EXPIRED: 'Vaša sesija je istekla, molim vas da se ulogujete ponovo',
  error_get_realization: 'Došlo je do greške prilikom učitavanja realizacija!',
  error_start_action_post: 'Došlo je do greške prilikom unosa podataka!',
  ACTION_CANNOT_COMPLETE: 'Ne može se izvršiti akcija!',
  error_save_app_param: 'Došlo je do greške prilikom čuvanja vrednosti parametra aplikacije!',
  error_not_valid_app_param: 'Vrednost parametra nije ispravna!',
  error_audio_controller_load: 'Došlo je do greške prilikom učitavanja audio kontrolera!',
  error_audio_controller_update: 'Došlo je do greške prilikom izmene audio kontrolera!',
};
