export function validateUserForm(data) {
    const errors = {};
    if (!data.name) errors.name = 'Ime je obvezno.';
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Neveljaven email naslov.';
    }
    return errors;
  }
  