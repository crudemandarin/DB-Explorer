const integerRG = /^$|^[+-]?\d+$/;
const floatRG = /^$|^[+-]?\d+(\.\d+)?$/;

class Utils {
  static getProtectedRows() {
    return [
      'ID',
      'CreatedBy',
      'UpdatedBy',
      'CreatedAt',
      'LastUpdated',
      'ActualCost',
      'ActualEffort',
      'TimeClosed',
    ];
  }

  static getNewID() {
    return crypto.randomUUID().substring(0, 6);
  }

  static getFormattedSQL(SQL) {
    return SQL;
  }

  static getEmptyForm(fields, opt) {
    const addMode = opt === 'add';
    return fields.reduce((obj, item) => {
      if (addMode && Utils.getProtectedRows().includes(item.name)) return obj;
      return {
        ...obj,
        [item.name]: {
          type: item.type,
          value: addMode ? item.default : '',
          isInvalid: false,
          error: '',
          nullable: item.nullable,
          isPrimaryKey: item.isPrimaryKey,
          isForeignKey: item.isForeignKey,
        },
      };
    }, {});
  }

  static getFormParams(tableForm) {
    return Object.keys(tableForm)
      .map((key) => ({ name: key, value: tableForm[key].value }))
      .filter((el) => !!el.value);
  }

  static validateForm(tableForm, option) {
    const form = { ...tableForm };
    let formIsValid = true;
    Object.keys(form).forEach((key) => {
      let [isValid, error] = [undefined, undefined];
      if (option === 'add') [isValid, error] = Utils.validateAdd(form[key]);
      else if (option === 'query') [isValid, error] = Utils.validateQuery(form[key]);
      form[key].isInvalid = !isValid;
      form[key].error = error;
      if (!isValid) formIsValid = false;
    });
    return [form, formIsValid];
  }

  static validateAdd(formData) {
    const { value, type, nullable } = formData;

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

  static validateQuery(formData) {
    const { value, type } = formData;

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
    } else if (type.includes('datetime')) {
      isValid = true;
    } else {
      console.warn('Utils.validate: Unrecognized type. type =', type);
    }

    return [isValid, error];
  }

  static getSuperKeys(fields) {
    const primaryKeyField = fields.filter((field) => field.isPrimaryKey);
    if (primaryKeyField.length) return primaryKeyField.map((field) => field.name);
    const foreignKeyFields = fields.filter((field) => field.isForeignKey);
    return foreignKeyFields.map((field) => field.name);
  }

  static getWhereParams(rows, fields) {
    const superKeys = Utils.getSuperKeys(fields);
    return rows.reduce((previous1, row) => {
      const superKeysOnly = Object.entries(row).reduce((previous2, pair) => {
        if (superKeys.includes(pair[0])) return [...previous2, { name: pair[0], value: pair[1] }];
        return previous2;
      }, []);
      return [...previous1, superKeysOnly];
    }, []);
  }
}

export default Utils;
