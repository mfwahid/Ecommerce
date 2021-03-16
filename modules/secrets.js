const ssm = require('./aws-client');

const saveSecret = async (username, password, entity,type) => {
  const secretName = `/${username}/${entity}`;
  console.log(`Saving secret to ${secretName}`); 

  const config = { 
    Name: secretName, 
    Value: password, 
    Type: type, 
    Overwrite: true
  }; 
  
  ssm.putParameter(config, (err, data) => { 
    if (err) { 
      console.log(err, err.stack); 
    } 
  });
};

const getSecret = async (secretName,entity) => {
  const secretFullName = `/${secretName}/${entity}`;  
  console.log(`Getting secret for ${secretFullName}`);
  const params = {
    Name: secretFullName, 
    WithDecryption: true
  };

  const result = await ssm.getParameter(params).promise();
  return result.Parameter.Value;
};

module.exports = {saveSecret, getSecret};
//module.exports.saveSecret = saveSecret;