;(function () {
	
	var dTable = null;
	var seriesTable = null;
	var seriedid = null;
	var fileName = null;
	
	var load_all_patients = function(){
        $.ajax({
           type  :   "get" ,
           contentType: "application/json",
           url  :   "http://localhost:8080/SpringRest/getallpatients",
           dataType :   "json",
           statusCode : {
           	   400: function(){
           	   },
           	   202: function(){
           	   },
           	   201: function(){
           	   }
           },
           success : function(result){
               for(var Patient of result)
               {
                   $("#side-menu").append('<li><a href="#"><i class="fa fa-user fa-fw"></i>'+Patient.PatientName+'</a></li>')
               }
       		},
           error : function(e){
           },
           complete : function(e, xhr, settings){
           }
        	   
        }); 
};

var append_patient_summary = function(result)
{
    $('#name').text(result[0].PatientName);
    $('#pid').text(result[0].PatientID);
    $('#dob').text(result[0].PatientBirthDate);
    console.log(result);
    $("tbody#stable tr").remove();
    for(var study of result)
    {
        for(var i = 0; i < study.StudyDescription.length;i++)
        {
            $("#stable").append("<tr class='odd gradeX'>"
                                +"<td>"+study.StudyDate[i]+"</td>"
                                +"<td>"+study.StudyDescription[i]+"</td>"
                                +"<td>"+((study.InstitutionName!=undefined)?study.InstitutionName[i]:'N/A')+"</td>"
                                +"<td class='center'>"+study.Modality[i]+"</td>"
                                +"<td class='center'>"+study.ReferringPhysicianName[i]+"</td>"
                                +"<td class='center'>"+study.StudyID[i]+"</td>"
                                +"</tr>");
        }
    }

};

var append_series_details = function(result)
{
    for(var series of result)
    {
        for(var i = 0; i < series.SeriesNumber.length;i++)
        {
            $("#seriest").append("<tr class='odd gradeX'>"
                                +"<td>"+series.SeriesNumber[i]+"</td>"
                                +"<td>"+series.SeriesDescription[i]+"</td>"
                                +"<td>"+series.SeriesInstanceUID[i]+"</td>"
                                +"</tr>");
        }
    }

};

var load_single_patient = function()
{
	$("#side-menu").on('click','a',function(){
		var data = {"patientname":$(this).text()}
        $.ajax({
            type  :   "post" ,
            contentType: "application/json",
            url  :   "http://localhost:8080/SpringRest/getsinglepatient",
            data :	JSON.stringify(data),
            dataType :   "json",
            statusCode : {
            	   400: function(){
            	   },
            	   202: function(){
            	   },
            	   201: function(){
            	   }
            },
            success : function(result){
        		   console.log("Success block ");
        		   append_patient_summary(result);
        		   dTable = null;
                   dTable = $('#dataTables-example').DataTable({
                       responsive: true,
                       destroy: true,
                       "columnDefs":[
                       	{
                       		"targets":[5],
                       		"visible":false
                       	}
                       ]
               });
                   dTable.draw();
                   
        		},
            error : function(e){
            },
            complete : function(e, xhr, settings){
            }
         	   
         }); 
		
	});
};

var data_table_click = function()
{
	$('#dataTables-example').on('click','tbody tr', function(){
		var data = {"studyid" : dTable.row(this).data()[5]};
        $.ajax({
            type  :   "post" ,
            contentType: "application/json",
            url  :   "http://localhost:8080/SpringRest/getseriesdetail",
            data :	JSON.stringify(data),
            dataType :   "json",
            statusCode : {
            	   400: function(){
            	   },
            	   202: function(){
            	   },
            	   201: function(){
            	   }
            },
            success : function(result){
        		   console.log(result);
        		   append_series_details(result);
                  
        		   seriesTable = $('#series-table').DataTable({
                       responsive: true,
                       searching: false,
                       lengthChange:false,
                       "columnDefs":[
                       	{
                       		"targets":[2],
                       		"visible":false
                       	}
                       ]
               });
        		},
            error : function(e){
            },
            complete : function(e, xhr, settings){
            }
         	   
         }); 
		
	});
};

var getImageUrl = function()
{
	$('#series-table').on('click','tbody tr', function(){
		var parents = document.getElementById("nav-bars");
		parents.style.zIndex = -1;
		var modal = document.getElementById('display-image');
		modal.style.display = "block";
		var span = document.getElementsByClassName("close")[0];
		var dicom_container = $("#dicom-container");
		var gui_container = $("#my-gui-container");
		
		span.onclick = function() {
			parents.style.zIndex = 1033;
			dicom_container.empty();
			gui_container.empty();
		    modal.style.display = "none";
		    
		}

		window.onclick = function(event) {
		    if (event.target == modal) {
				parents.style.zIndex = 1033;
				dicom_container.empty();
				gui_container.empty();
		        modal.style.display = "none";
		    }
		}
		
		var data = {"seriesId" : seriesTable.row(this).data()[2]};
		seriedid = seriesTable.row(this).data()[2];
		console.log(data)
        $.ajax({
            type  :   "post" ,
            contentType: "application/json",
            url  :   "../getImageUrl",
            data :	JSON.stringify(data),
            dataType :   "json",
            statusCode : {
            	   400: function(){
            	   },
            	   202: function(){
            	   },
            	   201: function(){
            	   }
            },
            success : function(result){
            	console.log(result)
            	fileName = result.url;
            	displayImage(result.url);
        		},
            error : function(e){
            },
            complete : function(e, xhr, settings){
            }
         	   
         }); 
		
	});
	
}


var displayImage = function(url)
{
	/* globals dat, AMI*/

	// Setup renderer
	var container = document.getElementById('dicom-container');
	var renderer = new THREE.WebGLRenderer({
	    antialias: true
	});
	renderer.setSize(container.offsetWidth, container.offsetHeight);
	renderer.setClearColor(0x353535, 1);
	renderer.setPixelRatio(window.devicePixelRatio);
	container.appendChild(renderer.domElement);

	// Setup scene
	var scene = new THREE.Scene();

	// Setup camera
	var camera = new AMI.OrthographicCamera(
	    container.clientWidth / -2,
	    container.clientWidth / 2,
	    container.clientHeight / 2,
	    container.clientHeight / -2,
	    0.1,
	    10000
	);

	// Setup controls
	var controls = new AMI.TrackballOrthoControl(camera, container);
	controls.staticMoving = true;
	controls.noRotate = true;
	camera.controls = controls;

	/**
	 * Handle window resize
	 */
	function onWindowResize() {
	    camera.canvas = {
	        width: container.offsetWidth,
	        height: container.offsetHeight,
	    };
	    camera.fitBox(2);

	    renderer.setSize(container.offsetWidth, container.offsetHeight);
	}
	window.addEventListener('resize', onWindowResize, false);

	/**
	 * Build GUI
	 */
	function gui(stackHelper) {
	    var gui = new dat.GUI({
	        autoPlace: false
	    });

	    var customContainer = document.getElementById('my-gui-container');
	    customContainer.appendChild(gui.domElement);
	    // only reason to use this object is to satusfy data.GUI
	    var camUtils = {
	        invertRows: false,
	        invertColumns: false,
	        rotate45: false,
	        rotate: 0,
	        orientation: 'default',
	        convention: 'radio',
	    };

	    // camera
	    var cameraFolder = gui.addFolder('Camera');
	    var invertRows = cameraFolder.add(camUtils, 'invertRows');
	    invertRows.onChange(function() {
	        camera.invertRows();
	    });

	    var invertColumns = cameraFolder.add(camUtils, 'invertColumns');
	    invertColumns.onChange(function() {
	        camera.invertColumns();
	    });

	    var rotate45 = cameraFolder.add(camUtils, 'rotate45');
	    rotate45.onChange(function() {
	        camera.rotate();
	    });

	    cameraFolder
	        .add(camera, 'angle', 0, 360)
	        .step(1)
	        .listen();

	    let orientationUpdate = cameraFolder.add(camUtils, 'orientation', ['default', 'axial', 'coronal', 'sagittal']);
	    orientationUpdate.onChange(function(value) {
	        camera.orientation = value;
	        camera.update();
	        camera.fitBox(2);
	        stackHelper.orientation = camera.stackOrientation;
	    });

	    let conventionUpdate = cameraFolder.add(camUtils, 'convention', ['radio', 'neuro']);
	    conventionUpdate.onChange(function(value) {
	        camera.convention = value;
	        camera.update();
	        camera.fitBox(2);
	    });

	    cameraFolder.open();

	    // of course we can do everything from lesson 01!
	    var stackFolder = gui.addFolder('Stack');
	    stackFolder
	        .add(stackHelper, 'index', 0, stackHelper.stack.dimensionsIJK.z - 1)
	        .step(1)
	        .listen();
	    stackFolder
	        .add(stackHelper.slice, 'interpolation', 0, 1)
	        .step(1)
	        .listen();
	    stackFolder.open();
	}

	/**
	 * Start animation loop
	 */
	function animate() {
	    controls.update();
	    renderer.render(scene, camera);

	    // request new frame
	    requestAnimationFrame(function() {
	        animate();
	    });
	}
	animate();

	var loader = new AMI.VolumeLoader(container);
	loader
	    .load(url)
	    .then(function() {
	        // merge files into clean series/stack/frame structure
	        var series = loader.data[0].mergeSeries(loader.data);
	        var stack = series[0].stack[0];
	        loader.free();
	        loader = null;
	        // be carefull that series and target stack exist!
	        var stackHelper = new AMI.StackHelper(stack);
	        // stackHelper.orientation = 2;
	        // stackHelper.index = 56;

	        // tune bounding box
	        stackHelper.bbox.visible = false;
	        // tune slice border
	        stackHelper.border.color = 0xff9800;
	        // stackHelper.border.visible = false;

	        scene.add(stackHelper);

	        // build the gui
	        gui(stackHelper);

	        // center camera and interactor to center of bouding box
	        // for nicer experience
	        // set camera
	        var worldbb = stack.worldBoundingBox();
	        var lpsDims = new THREE.Vector3(worldbb[1] - worldbb[0], worldbb[3] - worldbb[2], worldbb[5] - worldbb[4]);

	        // box: {halfDimensions, center}
	        var box = {
	            center: stack.worldCenter().clone(),
	            halfDimensions: new THREE.Vector3(lpsDims.x + 10, lpsDims.y + 10, lpsDims.z + 10)
	        };

	        // init and zoom
	        var canvas = {
	            width: container.clientWidth,
	            height: container.clientHeight,
	        };

	        camera.directions = [stack.xCosine, stack.yCosine, stack.zCosine];
	        camera.box = box;
	        camera.canvas = canvas;
	        camera.update();
	        camera.fitBox(2);
	    })
	    .catch(function(error) {
	        window.console.log('oops... something went wrong...');
	        window.console.log(error);
	    });

}

var update_comments_impressions = function()
{
	$(document).on('click','#updateimage',function(event){
		console.log("seriesid = " +seriedid);
		var filename = fileName.split("/");
		var comment = $("#comments").val().split(";");
		var impression = $("#impressions").val().split(";");
		var data = 
			{
				"seriesId" : seriedid,
				"filename" : filename[filename.length-1],
				"comments" : comment,
				"impressions" : impression
			}
		console.log(data);
        $.ajax({
            type  :   "post" ,
            contentType: "application/json",
            url  :   "http://localhost:8080/SpringRest/addCommentsAndImpressions",
            data :	JSON.stringify(data),
            dataType :   "json",
            statusCode : {
            	   400: function(){
            	   },
            	   202: function(){
            	   },
            	   201: function(){
            	   }
            },
            success : function(result){
        		   console.log("Success block ");
                   
        		},
            error : function(e){
            },
            complete : function(e, xhr, settings){
            }
         	   
         }); 
		
	});
};

$(function(){
        load_all_patients();
        load_single_patient();
        data_table_click();
        getImageUrl();
        update_comments_impressions();
	});
}());
