function getValue(object, key) {
  const keyParts = key.split('.');
  return keyParts.reduce(
    (obj, part) => (obj && obj[part] !== 'undefined' ? obj[part] : null),
    object,
  );
}

const FormatTypes = {
  date: function (value) {
    return new Date(value).toLocaleDateString();
  },
  hour: function (value) {
    return new Date(value).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  },
  dateAndHour: function (value) {
    return `${new Date(value).toLocaleDateString()} ${new Date(
      value,
    ).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })}
    `;
  },
};

export function formatValue(value, formatType = '') {
  if (FormatTypes && FormatTypes[formatType]) {
    return FormatTypes[formatType](value);
  }
  return value;
}

/*
  Data receive an object with the catalog data, example: {
    name: "example name"
    description: "description example"
    userGroup: {
      name: "group"
    }
  }

  Fields receive an object with the catalog data key and the Excel column name, example: {
    name: "Nombre"
    // If the column to use is nested
    "userGroup.name": "Grupo"
  }

  Format Config receive an objet with the config of format to apply to a especified value (the formats types are in the constant FormatTypes), example: {
    date: "date",
    date: "hour" 
  }

*/

export function convertStructure(data, fields, formatConfig) {
  // Headers
  const headers = Object.values(fields);

  // Map the data and return a new array with the desired structure
  const result = [
    headers,
    ...data.map(item =>
      Object.values(fields).map(header => {
        // Get the value of the field, handling nesting if necessary
        const key = Object.keys(fields).find(key => fields[key] === header);
        let value = getValue(item, key);

        if (formatConfig && formatConfig[key]) {
          value = formatValue(value, formatConfig[key]);
        }
        return value;
      }),
    ),
  ];

  return result;
}
