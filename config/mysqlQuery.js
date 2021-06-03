const INSERT_QUERY = 'REPLACE into devices_last_location set updated_on = now(), ? ';

module.exports =  INSERT_QUERY;