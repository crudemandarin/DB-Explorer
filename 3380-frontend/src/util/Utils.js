const integerRG = /^$|^[+-]?\d+$/;
const floatRG = /^$|^[+-]?\d+(\.\d+)?$/;
const varcharRG = /^$|^[A-Za-z\s]+$/;

class Utils {
  static getEmptyForm(fields) {
    return fields.reduce(
      (obj, item) => ({
        ...obj,
        [item.name]: { type: item.type, value: '', isInvalid: false },
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
      const { value, type } = form[key];
      form[key].isInvalid = !Utils.validate(value, type);
      if (form[key].isInvalid) isValid = false;
    });
    return [form, isValid];
  }

  static validate(value, type) {
    let result = true;

    if (type.includes('varchar')) {
      const length = parseInt(type.substring(type.indexOf('(') + 1, type.indexOf(')')), 10);
      result = varcharRG.test(value) && value.length <= length;
    } else if (type.includes('bigint') || type.includes('smallint')) {
      result = integerRG.test(value);
    } else if (type.includes('float')) {
      result = floatRG.test(value);
    } else {
      console.log('Utils.validate: Unrecognized type. type =', type);
    }

    return result;
  }
}

export default Utils;
