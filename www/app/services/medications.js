app.factory
(
	'medicationsService',
	[
	 	'$http','model','medicationsModel','constants','fhir-factory','utilities',
	 	function($http,model,medicationsModel,constants,adapter,utilities)
	 	{
	 		return {
	 			
	 			init: function()
	 			{
	 				var self = this;
	 				
	 				this.getStatements().then( this.getRecords() );
	 			},
	 			
	 			getStatements: function(success,error)
	 		    {
	 		    	var url = constants.REST_URL + "medicationstatement/search?patient_id=" + model.patient.id;
                   
	 		    	var result = $http.get(url,{headers: {'token':model.token}}).then
	 		    	(
	 		    		function(response)
	 		    		{
	 		    			var data = response.data;
	 		    			
	 		    			medicationsModel.statements = adapter.parseMedicationStatements( data );
	 		    			
	 		    			if( constants.DEBUG ) 
	                        	console.log( 'getStatements', data, medicationsModel.statements );
	 		    		}
	 		    	);
	 		    	
	 		    	if( success )
						result.success(success);
					if( error )
						result.error(error);
					
					return result;
	 		    },
	 		    
	 		    getRecords: function( data, success, error )
	 		    {
	 		    	var url = constants.REST_URL + "medicationadministration/search?patient_id=" + model.patient.id;
                 
	 		    	var result = $http.get(url,{headers: {'token':model.token}}).then
	 		    	(
	 		    		function(response)
	 		    		{
	 		    			var data = response.data;
	 		    			
	 		    			var records = adapter.parseMedicationRecords( data );
	 		    			records.sort( utilities.sortByDate );
	 		    			
	 		    			medicationsModel.records = records;
	 		    			
			 				if( constants.DEBUG ) 
			 				    console.log( 'getRecords', data, medicationsModel.records );
	 		    		}
	 		    	);
	 		    	
	 		    	if( constants.DEBUG ) console.log( 'getAdministrations', model.patient.id );
	 		    	
	 		    	if( success )
						result.success(success);
					if( error )
						result.error(error);
					
					return result;
	 		    },
	 		    
	 		    getMedications: function(success,error)
	 		    {
	 		    	var url = constants.REST_URL + "medication/search?name=" + search;
                   
	 		    	var result = $http.get(url,{headers: {'token':model.token}}).success
	 		    	(
	 		    		function(data, status, headers, config)
						{
	 		    			medicationsModel.medications = adapter.parseMedicationStatements( data );
	                        
	                        if( constants.DEBUG ) 
	                        	console.log( 'getStatements', data, medicationsModel.medications );
	                        
		                    if( success )
		                    	success( data, status, headers, config );
						}
	 		    	)
	 		    	.error
	 		    	(
	 		    		function(data, status, headers, config)
						{
	 		    			if( constants.DEBUG ) 
	                            console.log( "getStatements error", data );
	 		    			
	 		    			if( error )
	 		    				error( data, status, headers, config );
						}	
	 		    	);
                   
	 		    	if( constants.DEBUG ) console.log( 'getMedications', search );
	 		       
	 		    	return result;
	 		    },
	 		    
	 		    addMedicationRecord: function( data, success, error )
	 		    {
	 		    	var url = constants.REST_URL + "medicationadministration";
	 		    	
	 		    	var result = $http.put(url,data,{headers: {'token':model.token}});
	 		    	
	 		    	if( success )
						result.success(success);
					if( error )
						result.error(error);
					
					return result;
	 		    },
	 		    
	 			addStatement: function( data, success, error )
	 			{
	 				var medication = adapter.getMedicationStatement
										(
											model.patient.id,
											data.id,
											data.name,
											data.startTime,data.endTime,
											data.dosageRoute?data.dosageRoute:null,
											data.dosageQuantity?data.dosageQuantity:null,
											data.dosageUnit?data.dosageUnit:null,
											data.dosageFrequency?data.dosageFrequency:null,
											data.dosageRepeatUnit?data.dosageRepeatUnit:null
										);
	 				
					if( constants.DEBUG ) console.log( 'addStatement', medication );
					
					var url = constants.REST_URL + "medicationstatement";
					
					var result = $http.put(url,medication,{headers: {'token':model.token}});
					
					if( success )
						result.success(success);
					if( error )
						result.error(error);
					
					return result;
	 			},
	 			
	 			deleteStatement: function( data, success, error )
                {
                    var url = constants.REST_URL + "medicationstatement/delete/@" + data.id;
                    
                    var result = $http['delete'](url,{headers: {'token':model.token}});
                    
                    if( success )
						result.success(success);
					if( error )
						result.error(error);
					
					return result;
                },
                
                deletAdministration: function( patientId, medicationAdministration, success, error )
                {
                    var url = constants.REST_URL + "medicationadministration/delete/@" + medicationAdministration.id;
                    
                    var result = $http['delete'](url,{headers: {'token':model.token}});
                    
                    if( success )
						result.success(success);
					if( error )
						result.error(error);
					
					return result;
                },
	 			
	 			getRecordsForTracker: function(tracker)
	 			{
	 				var records = new Array();
	 				
	 				for(var r in medicationsModel.records)
	 					if( medicationsModel.records[r].id == tracker.definition.id )
	 						records.push( medicationsModel.records[r] );
	 				
	 				return records;
	 			}
	 		};
	 	}	 
	 ]
);