const integerRG = /^$|^[+-]?\d+$/;
const floatRG = /^$|^[+-]?\d+(\.\d+)?$/;

class Utils {
  static getNewQueryID() {
    return crypto.randomUUID().substring(0, 6);
  }

  static getEmptyForm(fields) {
    return fields.reduce(
      (obj, item) => ({
        ...obj,
        [item.name]: {
          type: item.type,
          value: '',
          isInvalid: false,
          error: '',
          nullable: item.nullable,
          isPrimaryKey: item.isPrimaryKey,
          isForeignKey: item.isForeignKey,
        },
      }),
      {}
    );
  }

  static getFormParams(tableForm) {
    return Object.keys(tableForm)
      .map((key) => ({ name: key, value: tableForm[key].value }))
      .filter((el) => !!el.value);
  }

  static validateForm(tableForm) {
    const form = { ...tableForm };
    let formIsValid = true;
    Object.keys(form).forEach((key) => {
      const [isValid, error] = Utils.validate(form[key]);
      form[key].isInvalid = !isValid;
      form[key].error = error;
      if (!isValid) formIsValid = false;
    });
    return [form, formIsValid];
  }

  static validate(formData) {
    const { value, type, nullable } = formData;

    // if (isPrimaryKey) return true;

    let isValid = true;
    let error = '';

    if (type.includes('varchar')) {
      const length = parseInt(type.substring(type.indexOf('(') + 1, type.indexOf(')')), 10);
      isValid = value.length <= length;
      if (!isValid) error = `Length must be less than ${length}`;
    } else if (type.includes('bigint') || type.includes('smallint')) {
      isValid = integerRG.test(value);
      if (!isValid) error = `Must be integer`;
    } else if (type.includes('float')) {
      isValid = floatRG.test(value);
      if (!isValid) error = `Must be float`;
    } else {
      console.warn('Utils.validate: Unrecognized type. type =', type);
    }

    if (!nullable && (!value || value.length === 0)) {
      isValid = false;
      error = 'Cannot be empty';
    }

    return [isValid, error];
  }
}

export default Utils;
