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
    let isValid = true;
    Object.keys(form).forEach((key) => {
      form[key].isInvalid = !Utils.validate(form[key]);
      if (form[key].isInvalid) isValid = false;
    });
    return [form, isValid];
  }

  static validate(formData) {
    const { value, type, nullable } = formData;

    // if (isPrimaryKey) return true;

    let result = true;

    if (type.includes('varchar')) {
      const length = parseInt(type.substring(type.indexOf('(') + 1, type.indexOf(')')), 10);
      result = value.length <= length;
    } else if (type.includes('bigint') || type.includes('smallint')) {
      result = integerRG.test(value);
    } else if (type.includes('float')) {
      result = floatRG.test(value);
    } else {
      console.warn('Utils.validate: Unrecognized type. type =', type);
    }

    if (!nullable && (!value || value.length === 0)) result = false;

    return result;
  }
}

export default Utils;
