jQuery.sap.require("sap.ui.veh_transuni.util.Formatter");
jQuery.sap.require("sap/ui/model/json/JSONModel");
jQuery.sap.require("sap/m/MessageToast");
jQuery.sap.require("sap/m/Table");
// jQuery.sap.require("sap/m/semantic");

sap.ui.define([
   "sap/ui/veh_transuni/controller/BaseController",
   "sap/m/MessageBox",
   "sap/ui/model/json/JSONModel",
   "sap/m/Token",
   "sap/ui/veh_transuni/util/Formatter",
   "sap/ui/model/Filter",
   "sap/ui/model/FilterOperator"
], function (BaseController, MessageBox, JSONModel, Token, formatter, Filter, FilterOperator) {
  "use strict";
	var urlGlobal = "/DEV_TO_ODVIATICOS/odata/SAP/ZSCP_VEHICULOS_SRV";
	// var urlGlobal = "https://gwaas-d85e9224f.us2.hana.ondemand.com/odata/SAP/ZSCP_VEHICULOS_SRV";
	var click = 1;
	var clk_m = 1;
	var clk_t = 1;
	var tableuse;
	var that;
	var oModel;
	var Series = [];
	var Modelo = [];
	var Lotes = [];

  return BaseController.extend("sap.ui.veh_transuni.controller.Home", {
    formatter: formatter,
    onInit : function () {
		that = this;
		Lotes = [];
		Series = [];
		Modelo = [];
		var myModel = this.getOwnerComponent().getModel();
		myModel.setSizeLimit(99999);
		that = this;
      
		var oView = this.getView();
		// Configurando Multi Input de Serie
		var oMultiInput1 = oView.byId("serie");
		//*** add checkbox validator
		oMultiInput1.addValidator(function(args) {
			var text = args.text;
			return new Token({
				key: text,
				text: text
			});
		});
		
		// Configurando Multi Input de Modelo
		var oMultiInput2 = oView.byId("idModelo");
		//*** add checkbox validator
		oMultiInput2.addValidator(function(args) {
			var text = args.text;
			return new Token({
				key: text,
				text: text
			});
		});
		var isMobile = sap.ui.Device.system.phone;       
		if (isMobile) {
			tableuse = "tblVisualizarM";
			that.getView().byId("tblVisualizarT").setVisible(false);
			that.getView().byId("tblVisualizarM").setVisible(true);
		}else {
			tableuse = "tblVisualizarT";
			that.getView().byId("tblVisualizarT").setVisible(true);
			that.getView().byId("tblVisualizarM").setVisible(false);
			that.getView().byId("botonVolver").setVisible(false);
		}
	
      that.getView().byId("tblVisualizarT").getTable().setMode("MultiSelect");

      oModel = new sap.ui.model.odata.v2.ODataModel(urlGlobal, true);
	},
    onButton1: function(){
      if(this.getView().byId("idButton1").getSelected() == true){
        this.getView().byId("FrmElemntFecIni").setVisible(false);
        this.getView().byId("FrmElemntFecFin").setVisible(false);
        this.getView().byId("dateInicio").setVisible(false);
        this.getView().byId("dateFin").setVisible(false);
        this.getView().byId("idColumnCliente").setVisible(true);
        this.getView().byId("idColumnEstado").setVisible(false);
        this.getView().byId("idSelectTrans").setVisible(true);
        this.getView().byId("idExecute").setVisible(true);
      }
    },
    onButton2: function(){
      if(this.getView().byId("idButton2").getSelected() == true){
        this.getView().byId("FrmElemntFecIni").setVisible(true);
        this.getView().byId("FrmElemntFecFin").setVisible(true);
        this.getView().byId("dateInicio").setVisible(true);
        this.getView().byId("dateFin").setVisible(true);
        this.getView().byId("idColumnCliente").setVisible(false);
        this.getView().byId("idColumnEstado").setVisible(true);
        this.getView().byId("idSelectTrans").setVisible(false);
        this.getView().byId("idExecute").setVisible(false);
      }
    },
    onPressItem: function(){
      tableuse = "tblVisualizarT";
      
      this.getView().byId("tblVisualizarT").setVisible(true);
      this.getView().byId("botonVolver").setVisible(true);
      this.getView().byId("tblVisualizarM").setVisible(false);
      
      click = clk_t;
      this.goTo(click);
      
      if(click == 1) this.getView().byId("btnAnterior").setEnabled(false);
      else this.getView().byId("btnAnterior").setEnabled(true);
    },
    onVolver: function(){
      tableuse = "tblVisualizarM";
      
      this.getView().byId("tblVisualizarT").setVisible(false);
      this.getView().byId("botonVolver").setVisible(false);
      this.getView().byId("tblVisualizarM").setVisible(true);
      
      click = clk_m;
      this.goTo(click);
      
      if(click === 1) this.getView().byId("btnAnterior").setEnabled(false);
      else this.getView().byId("btnAnterior").setEnabled(true);
    },
    onShow: function(oEvent){
		click = 1;
		this.goTo(click);
	},
	range: function(oInit, oEnd, oData){
       $.each(oData, function(key, item){
        
           var sId = item.sId;
           
           if(key >= oInit && key <= oEnd){
               sap.ui.getCore().byId(sId).setVisible(true);
           }else{                    
               sap.ui.getCore().byId(sId).setVisible(false);
           }
           
       });

    },
    goTo: function(oClick){
       var oSelectItem = this.getView().byId("sShow").getSelectedKey();
       var oTable =  this.getView().byId(tableuse).getTable().getItems();
       var oTotal = oTable.length;
       var oShow = Math.ceil(oTotal / oSelectItem);
       
       if(oClick <= oShow){
        
           if(oShow == oClick){
              this.getView().byId("btnSiguiente").setEnabled(false);
           }else{
              this.getView().byId("btnSiguiente").setEnabled(true);
           }
           
           this.range(oSelectItem * (oClick - 1), (oSelectItem * oClick) - 1, oTable);
       }
       
       if(oClick <= 1){
          this.getView().byId("btnAnterior").setEnabled(false);
       }    
   },
    goNext: function(){
        this.goTo(click += 1); 
        
        if(tableuse == "tblVisualizarM") clk_m = click;
        else clk_t = click;
        
        if(click != 0){
            this.getView().byId("btnAnterior").setEnabled(true);
        }else{
            this.getView().byId("btnAnterior").setEnabled(false);
        }
    },
    goPrevious: function(){
        this.goTo(click -= 1);
        
        if(tableuse == "tblVisualizarM") clk_m = click;
        else clk_t = click;
        
        if(click <= 1){
            this.getView().byId("btnAnterior").setEnabled(false);
        }else{
            this.getView().byId("btnAnterior").setEnabled(true);
        }
    },
	onLoadT: function(oEvent){ //Evento se activa cuando trae data el smart table desktop
		sap.ui.core.BusyIndicator.hide();
		var tblcant = this.getView().byId(tableuse).getTable().getItems().length;
		if(tblcant == 0){
		
		this.getView().byId("btnSiguiente").setEnabled(false);
		this.getView().byId("btnAnterior").setEnabled(false);
		
		}else{
		
		this.getView().byId("btnSiguiente").setEnabled(true);
		this.getView().byId("btnAnterior").setEnabled(true);
		
		}
		
		this.goTo(click);
		
		if(click === 1) this.getView().byId("btnAnterior").setEnabled(false);
		else this.getView().byId("btnAnterior").setEnabled(true);
	},
	onLoadM: function(oEvent){ //Evento se activa cuando trae data el smart table MOBILE
      var tblcant = this.getView().byId(tableuse).getTable().getItems().length;
    
      if(tblcant == 0){
        
        this.getView().byId("btnSiguiente").setEnabled(false);
        this.getView().byId("btnAnterior").setEnabled(false);
        
      }else{
        
        this.getView().byId("btnSiguiente").setEnabled(true);
        this.getView().byId("btnAnterior").setEnabled(true);
        
      }
    
      this.goTo(click);
      
      if(click === 1) this.getView().byId("btnAnterior").setEnabled(false);
      else this.getView().byId("btnAnterior").setEnabled(true);
      sap.ui.core.BusyIndicator.hide();
    },
    //Función para buscar
	onSearchList: function() {
		if(this.getView().byId("idButton2").getSelected() == true){
			if(this.getView().byId("dateInicio").getValue() == "" || this.getView().byId("dateFin").getValue() == ""){
				sap.m.MessageBox.warning("Por favor, completar los datos obligatorios");
			}else{
				if(sap.ui.Device.system.phone){
					this.getView().byId("tblVisualizarT").rebindTable();
					this.getView().byId("tblVisualizarM").rebindTable();	
				}else{
					this.getView().byId("tblVisualizarT").rebindTable();
				}
			}
		}else{
			if(sap.ui.Device.system.phone){
				this.getView().byId("tblVisualizarT").rebindTable();
				this.getView().byId("tblVisualizarM").rebindTable();	
			}else{
				this.getView().byId("tblVisualizarT").rebindTable();
			}
		}
    },
    onBeforeTBL: function(oEvent){
    	sap.ui.core.BusyIndicator.show(0); // mostrando la barra de Busy
    	Lotes = [];
      var fdesde = that.getView().byId("dateInicio").getValue();
      var fhasta = that.getView().byId("dateFin").getValue();
      var tokenModelos = that.getView().byId("idModelo").getTokens();
      var tokenSeries = this.getView().byId("serie").getTokens();
      var button1 = that.getView().byId("idButton1").getSelected();
      var button2 = that.getView().byId("idButton2").getSelected();
      var aFilter = oEvent.mParameters.bindingParams.filters;//+@WVF001
		// 000000000000001220
      if(fdesde === null) {fdesde = "";}
      if(fhasta === null) {fhasta = "";}

      //Fechas
      if(fdesde !== "" && fhasta !== ""){
        aFilter.push(new Filter("Fecdesad", FilterOperator.BT,new Date(fdesde + " 05:00"),new Date(fhasta + " 05:00")));
      }
      
      if(button1 == true){
        aFilter.push(new Filter("Observacion", FilterOperator.EQ, "1"));  
      }
      if(button2 == true){
        aFilter.push(new Filter("Observacion", FilterOperator.EQ, "2"));  
      }

      //Serie
      var serieTmp = tokenSeries.map(function(c) {
          return that.onCompleteFormat(c.getKey(), 10);
        });
	
		// Esctructura de numeros de serie
		$.each(serieTmp, function(index, item) {
			aFilter.push(
				new Filter("Serie", FilterOperator.EQ, item)
			);
		});
		
		//Serie
      var modeloTmp = tokenModelos.map(function(c) {
			return c.getKey();
		});
	
		// Esctructura de numeros de serie
		$.each(modeloTmp, function(index, item) {
			var modelo = that.onCompleteFormat(item, 18);
			aFilter.push(
				new Filter("Model", FilterOperator.EQ, modelo)
			);
		});
      oEvent.mParameters.bindingParams.filters = aFilter;
    },
    //****************************************************Abrir ventana de la busqueda de Modelo
	buscaModelo: function() {
		this._oDialog3 = sap.ui.xmlfragment("diagModelo", "sap.ui.veh_transuni.fragment.Modelo", this);
		this._oDialog3.open();

		var oModel = new JSONModel(Modelo);
		var oTable = sap.ui.getCore().byId("diagModelo--tbBusqueda");
		oTable.setModel(oModel);

		// var oMultiInput1 = sap.ui.getCore().byId("diagModelo--codigo");
		// //*** add checkbox validator
		// oMultiInput1.addValidator(function(args) {
		// 	var text = args.text;

		// 	return new Token({
		// 		key: text,
		// 		text: text
		// 	});
		// });
	},
	//Seleccionar Material de la búsqueda
	seleccionarModelo: function() {
		var oTable = sap.ui.getCore().byId("diagModelo--tbBusqueda");
		var tokenTmp = [];
		var contexts = oTable.getSelectedContexts();
		
		if (contexts.lenght != 0) {
			var items = contexts.map(function(c) {
				return c.getObject();
			});

			var oView = this.getView();
			var oMultiInput1 = oView.byId("idModelo");

			// Agregar nuevas tokens. Si se quiere reemplaza, utilizar setTokens
			//tokenTmp.push(new Token({text: item.qmtxt, key: item.qmart}));

			$.each(items, function(index, item) {
				oMultiInput1.addToken(new Token({
					text: item.matnr,
					key: item.matnr
				}));
			});

			this._oDialog3.destroy();
		} else {
			sap.m.MessageBox.error("Debe seleccionar por lo menos un materia");
		}
	},

	//Cerrar ventana de la busqueda de Serie
	cancelarModelo: function() {
		this._oDialog3.destroy();
	},

	BuscarModelo: function() {
		sap.ui.core.BusyIndicator.show(0); // mostrando la barra de Busy

		// var tokenSeries = sap.ui.getCore().byId("diagModelo--codigo").getTokens();
		var material = sap.ui.getCore().byId("diagModelo--material").getValue();
		var descripcion = sap.ui.getCore().byId("diagModelo--descripcion").getValue();
		var nreg = sap.ui.getCore().byId("diagModelo--cantidad").getSelectedKey();
		var PI_SERIE = [];
		var filter = [];
		var filterPar;

		// var serieTmp = tokenSeries.map(function(c) {
		// 	return c.getKey();
		// });

		// Esctructura de numeros de serie
		// $.each(serieTmp, function(index, item) {
			var elemento = {
				'SIGN': 'I',
				'OPTION': "EQ",
				'LOW': "VEHI"
			};
			PI_SERIE.push(elemento);
		// });

		// Estructura a enviar en servicio
		var datos = {
			'PI_NOMBRE': descripcion,
			'PI_CANTIDAD': nreg,
			'PI_MATNR': material
		};
		filterPar = new sap.ui.model.Filter("Parametros", sap.ui.model.FilterOperator.EQ, JSON.stringify(datos));
		filter.push(filterPar);
		
		filterPar = new sap.ui.model.Filter("Data", sap.ui.model.FilterOperator.EQ, JSON.stringify(PI_SERIE));
		filter.push(filterPar);
		
		var filterId = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, "26");
        filter.push(filterId);
        
        // Obteniendo los datos del servicio odata
		var oModel = new sap.ui.model.odata.v2.ODataModel(urlGlobal, true);
		
		//EntitySet es el entityset del metadata 
		oModel.read("/PRC_VEHICULOSSet" ,{
			method: "GET",
			filters: filter,
			success: function(result, status, xhr){
				var rpta = JSON.parse(result.results[0].Json);
				var oModel = new JSONModel(rpta);
				var oTable = sap.ui.getCore().byId("diagModelo--tbBusqueda");
				oTable.setModel(oModel);
				sap.ui.core.BusyIndicator.hide();
			},
			error: function(xhr,status,error){
				sap.ui.core.BusyIndicator.hide();
				MessageBox.error(xhr.statusText);
			},
			urlParameters: {
                search: "GET"
            }

		});
	},
    //************************************************************Abrir ventana de la busqueda de Serie
	buscaSerie: function() {
		this._oDialog = sap.ui.xmlfragment("diagSerie", "sap.ui.veh_transuni.fragment.Serie", this);
		this._oDialog.open();

		var oModel = new JSONModel(Series);
		var oTable = sap.ui.getCore().byId("diagSerie--tbBusqueda");
		oTable.setModel(oModel);

		var oMultiInput1 = sap.ui.getCore().byId("diagSerie--codigo");
		//*** add checkbox validator
		oMultiInput1.addValidator(function(args) {
			var text = args.text;

			return new Token({
				key: text,
				text: text
			});
		});
	},
	//Seleccionar serie de la búsqueda
	seleccionarSerie: function() {
		var oTable = sap.ui.getCore().byId("diagSerie--tbBusqueda");
		var tokenTmp = [];
		var contexts = oTable.getSelectedContexts();
		
		if (contexts.lenght != 0) {
			var items = contexts.map(function(c) {
				return c.getObject();
			});

			var oView = this.getView();
			var oMultiInput1 = oView.byId("serie");

			// Agregar nuevas tokens. Si se quiere reemplaza, utilizar setTokens
			//tokenTmp.push(new Token({text: item.qmtxt, key: item.qmart}));

			$.each(items, function(index, item) {
				oMultiInput1.addToken(new Token({
					text: parseInt(item.vhcle),
					key: parseInt(item.vhcle)
				}));
			});

			this._oDialog.destroy();
		} else {
			sap.m.MessageBox.error("Debe seleccionar por lo menos una serie");
		}
	},

	//Cerrar ventana de la busqueda de Serie
	cancelarBuscarSerie: function() {
		this._oDialog.destroy();
	},

	BuscarSerie: function() {
		sap.ui.core.BusyIndicator.show(0); // mostrando la barra de Busy

		var tokenSeries = sap.ui.getCore().byId("diagSerie--codigo").getTokens();
		var material = sap.ui.getCore().byId("diagSerie--material").getValue();
		var descripcion = sap.ui.getCore().byId("diagSerie--descripcion").getValue();
		var nreg = sap.ui.getCore().byId("diagSerie--cantidad").getSelectedKey();
		var PI_SERIE = [];
		var filter = [];
		var filterPar;
		var thes = this;

        var serieTmp = tokenSeries.map(function(c) {
          return thes.onCompleteFormat(c.getKey(), 10);
        });

		// Esctructura de numeros de serie
		$.each(serieTmp, function(index, item) {
			var elemento = {
				'SIGN': 'I',
				'OPTION': "EQ",
				'LOW': item
			};
			PI_SERIE.push(elemento);
		});

		// Esctructura de materiales
		if (material != "") {
			var PI_MATNR = [{
				'SIGN': 'I',
				'OPTION': "EQ",
				'LOW': material
			}];
		} else {
			var PI_MATNR = [];
		}

		// Estructura a enviar en servicio
		var datos = {
			'|PI_MAKTX': descripcion,
			'|PI_NREG': nreg,
			'|PI_SERIE': PI_SERIE,
			'|PI_MATNR': PI_MATNR
		};
		
		filterPar = new sap.ui.model.Filter("Parametros", sap.ui.model.FilterOperator.EQ, JSON.stringify(datos));
		filter.push(filterPar);
		
		var filterId = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, "06");
        filter.push(filterId);
        
        // Obteniendo los datos del servicio odata
		var oModel = new sap.ui.model.odata.v2.ODataModel(urlGlobal, true);
		
		//EntitySet es el entityset del metadata 
		oModel.read("/PRC_VEHICULOSSet" ,{
			method: "GET",
			filters: filter,
			success: function(result, status, xhr){
				var rpta = JSON.parse(result.results[0].Json);
				
				var oModel = new JSONModel(rpta);
				var oTable = sap.ui.getCore().byId("diagSerie--tbBusqueda");
				oTable.setModel(oModel);
					
				sap.ui.core.BusyIndicator.hide();
			},
			error: function(xhr,status,error){
				sap.ui.core.BusyIndicator.hide();
				MessageBox.error(xhr.statusText);
			},
			urlParameters: {
                search: "POST"
            }

		});
	},
	onChangeItem: function(event){
		sap.ui.core.BusyIndicator.show(0);
		var cont = that.getView().byId("tblVisualizarT").getTable().getSelectedItems();
    	if(cont.length !== 0){
    		var avail = event.getSource().getSelectedItem().getBindingContext().getObject().Avail;
    		var filter = [];
			var filterPar;
	    	
	    	filterPar = new sap.ui.model.Filter("Parametros", sap.ui.model.FilterOperator.EQ, avail);
			filter.push(filterPar);
			
			var filterId = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, "28");
	        filter.push(filterId);
	        
	    	oModel.read("/PRC_VEHICULOSSet",{
	    		method: "GET",
				filters: filter,
				urlParameters: {
	                search: "GET"
	            },
				success: function(result, status, xhr){
					var resultado = JSON.parse(result.results[0].Json);
					var ItemsTrans = new JSONModel({
						"itemsTrans": resultado
					});
					that.getView().byId("idSelectTrans").setModel(ItemsTrans, "resultado");
					sap.ui.core.BusyIndicator.hide();
				},
				error: function(xhr,status,error){
					sap.ui.core.BusyIndicator.hide();
					MessageBox.error(xhr.statusText);
				}
	    	});
    	}
		sap.ui.core.BusyIndicator.hide();
	},
    onEjecutar: function(){
    	var cont = that.getView().byId("tblVisualizarT").getTable().getSelectedItems();
    	if(cont.length !== 0){
    		Lotes = [];
    		var data = [];
    		var Items = that.getView().byId("tblVisualizarT").getTable().getSelectedContextPaths();
    		var OData = that.getView().byId("tblVisualizarT").getTable().getModel().oData;
    		for(var i = 0; i < Items.length; i++){
				var row = OData[Items[i].toString().replace("/","")];
				var date = row.Fecdesad;
				if(date == null){
					date = "00000000";
				}else{
					date = row.Fecdesad;
				}
				var kunnr = that.onCompleteFormat(row.Kunnr, 10);
				var element = {
					"Avail" : row.Avail,
					"Availtxt" : row.Availtxt,
					"Cmpgn" : row.Cmpgn,
					"Fecdesad" : date,
					"Kunnr" : kunnr,
					"Matnr" : row.Matnr,
					"Model" : row.Model,
					"PagoAnticipado" : row.PagoAnticipado,
					"Serie" : row.Serie,
					"Statu" : row.Statu,
					"Statut" : row.Statut,
					"Vapor" : row.Vapor,
					"ZzanoFab" : row.ZzanoFab,
					"ZzanoMod" : row.ZzanoMod,
					"ZzcolorDesc" : row.ZzcolorDesc
				};
				data.push(element);
    		}
    		var filter = [];
			var filterPar;
	    	filterPar = new sap.ui.model.Filter("Data", sap.ui.model.FilterOperator.EQ, JSON.stringify(data));
			filter.push(filterPar);
			
			var filterId = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, "29");
	        filter.push(filterId);
	        sap.ui.core.BusyIndicator.show(0);
			oModel.read("/PRC_VEHICULOSSet",{
				filters: filter,
				urlParameters: {
		            search: "GET"
		        },
				success: function(result, status, xhr){
					var resultado = JSON.parse(result.results[0].Json);
					if(resultado.length){
						sap.m.MessageBox.warning(resultado[0].message);
					}else{
						var Title = that.getView().byId("idSelectTrans").getSelectedItem().getText();
						var oModel = new JSONModel(resultado.lotes);
						Lotes = resultado.lotes;
						var kunnr = resultado.kunnr;
						that._oDialog = sap.ui.xmlfragment("idTransferencia", "sap.ui.veh_transuni.fragment.Transferencia", that);
						that._oDialog.open();
                		sap.ui.getCore().byId("idTransferencia--idTitle").setText(Title);
                		sap.ui.getCore().byId("idTransferencia--TBVehiculos").setModel(oModel);
                		sap.ui.getCore().byId("idTransferencia--idOrig").setValue(kunnr.substring(6,10));
                		sap.ui.getCore().byId("idTransferencia--idSerie").setText(resultado.serie);
					}
					sap.ui.core.BusyIndicator.hide();
				},
				error: function(xhr,status,error){
					sap.ui.core.BusyIndicator.hide();
					MessageBox.error(xhr.statusText);
				}
			});
    	}else{
    		sap.m.MessageBox.error("Debe seleccionar al menos una fila");
    	}
    },
    onTransferir: function(){
    	var Lote = Lotes;
    	var error = true;
    	var Serie = sap.ui.getCore().byId("idTransferencia--idSerie").getText(); 
		var keyCombo = that.getView().byId("idSelectTrans").getSelectedItem().getKey();
		var desCombo = that.getView().byId("idSelectTrans").getSelectedItem().getText();
    	var Orig = sap.ui.getCore().byId("idTransferencia--idOrig").getValue();
    	var Dest = sap.ui.getCore().byId("idTransferencia--Solicitant").getValue();
    	if(Dest === ""){
    		sap.m.MessageBox.warning("Falta ingresar Solicitante destino.");
    		error = false;
    	}else if(Dest === Orig){
    		sap.m.MessageBox.warning("Solicitante destino no puede ser igual a Solicitante origen.");
    		error = false;
    	}else{
    		error =  true;
    	}
    	if(error === true){
    		Orig = that.onCompleteFormat(Orig, 10);
    		Dest = that.onCompleteFormat(Dest, 10);
    		//Creamos los parámetros
			var jsonParametros = {
				"serie"		:	Serie,
				"kunnr"		:	Orig,
				"kunnr2"	:	Dest,
				"aktion"	:	keyCombo,
				"aktiont"	: 	desCombo
			};
			jsonParametros = JSON.stringify(jsonParametros);
			//Creamos los filtros
			var Filter1 = [];
			var Filter = [];
			
			Filter = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, "30");
			Filter1.push(Filter);
			Filter = new sap.ui.model.Filter("Parametros", sap.ui.model.FilterOperator.EQ, jsonParametros);
			Filter1.push(Filter);
			Filter = new sap.ui.model.Filter("Data", sap.ui.model.FilterOperator.EQ, JSON.stringify(Lote));
			console.log(Filter);
			Filter1.push(Filter);
			sap.ui.core.BusyIndicator.show(0);
	    	oModel.read("/PRC_VEHICULOSSet", {
	    		filters: Filter1,
				urlParameters: {
					"search":"GET"
				},
	    		success: function(result){
	    			sap.ui.core.BusyIndicator.hide();
	    			var resultado = JSON.parse(result.results[0].Json);
	    			console.log(resultado);
	    			if(resultado[0].type === "S"){
	    				sap.m.MessageBox.success(resultado[0].message, {onClose:function(){that._oDialog.destroy();}});
	    			}else{
	    				sap.m.MessageBox.error(resultado[0].message);
	    			}
	    			Lotes = [];
	    		},
	    		error: function(xhr,status,error){
	    			sap.ui.core.BusyIndicator.hide();
	    			MessageBox.error(xhr.statusText);
	    		}
	    	});	
    	}
    	
    },
	onCancelar: function(){
    	Lotes = [];
    	this._oDialog.destroy();
	},
	//FILTRO SOLICITANTE DENTRO DE TRANSFERENCIAS
	onFiltroSolicitante: function(oEvent){
		var control = "";
	    this._oDialog2 = sap.ui.xmlfragment("xmlFilterSolicitante","sap.ui.veh_transuni.fragment.FiltroSolicitante", this);
	    control = oEvent.getParameters().id;
	    
	    localStorage.ValorOuput = oEvent.getParameters().id;
	    localStorage.ValorInput = "kunnr";
	    localStorage.ValorMid = "idTransferencia--SolText";
	    // if(control.includes("Des")){
	    // 	localStorage.ValorMid = "DesText";
	    // }else if(control.includes("Sol")){
	    // 	localStorage.ValorMid = "SolText";	
	    // }else{
	    // 	localStorage.ValorMid = "-1";	
	    // }
	    this._oDialog2.open();
	},
	onSearchSolicitante: function(oEvent){
	    var concbusqueda = sap.ui.getCore().byId("xmlFilterSolicitante--txtConcbusqueda").getValue();
	    var codigo = sap.ui.getCore().byId("xmlFilterSolicitante--txtCodigo").getValue();
	    var poblacion = sap.ui.getCore().byId("xmlFilterSolicitante--txtPoblacion").getValue();
	    var nombre = sap.ui.getCore().byId("xmlFilterSolicitante--txtNombre").getValue();
	    var cliente = sap.ui.getCore().byId("xmlFilterSolicitante--txtCliente").getValue();
	    var cant = sap.ui.getCore().byId("xmlFilterSolicitante--CantSol").getValue();

	    var datajs = [];
	    var datasend = "";
	    var typeFilter = "EQ";
	    
	    if(cant === "" || cant === 0 || cant.includes("e")) {
	    	sap.ui.getCore().byId("xmlFilterSolicitante--CantSol").setValue("500");
	    	cant = 500;
	    }
	    
		if(cliente !== "")
		{
	    	datajs = [{"SIGN":"I","OPTION":typeFilter,"LOW": cliente,"HIGH":""}];
		}
	    
	    datasend = JSON.stringify(datajs);
	    
	    sap.ui.core.BusyIndicator.show();
	    var filters = [];
	    var filter = [];
	    
	    filter = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, "57");
	    filters.push(filter);
	    
	    filter = new sap.ui.model.Filter("Data", sap.ui.model.FilterOperator.EQ, datasend);
	    filters.push(filter);
	    
	    var Data = concbusqueda + "," + codigo + "," + poblacion + "," + nombre + ",," + cant;
	    filter = new sap.ui.model.Filter("Parametros", sap.ui.model.FilterOperator.EQ, Data);
	    filters.push(filter);
	    
		oModel.read("/PRC_VEHICULOSSet",{
			filters: filters,
			urlParameters: {
			   "search": "GET"
			},
			success: function (result, status, xhr) {
				result = JSON.parse(result.results[0].Json);
				
				if(result[0].type === undefined){
			        var oModelJson = new sap.ui.model.json.JSONModel(result);
			        sap.ui.getCore().byId("xmlFilterSolicitante--tbFilterSolicitante").setModel(oModelJson);
				}else{
					MessageBox.information(result[0].message);
			    	sap.ui.getCore().byId("xmlFilterSolicitante--tbFilterSolicitante").setModel(new JSONModel());
				}
				sap.ui.core.BusyIndicator.hide();
			},
			error: function (xhr, status, error) {
				sap.ui.core.BusyIndicator.hide();
				MessageBox.error(xhr.statusText);
			}
		});
	},
	onSelectItemTbl: function(oEvent){
        var valor = oEvent.getSource().getBindingContext().getProperty(localStorage.ValorInput);
        
		try{
			sap.ui.getCore().byId(localStorage.ValorOuput).setValue(valor);
			if(localStorage.ValorMid !== "" && localStorage.ValorMid !== "-1"){
				this.getView().byId(localStorage.ValorMid).setText(oEvent.getSource().getBindingContext().getProperty("name1"));
			}
        	this._oDialog2.destroy();		
		}catch(ex){
        	this._oDialog2.destroy();
		}
    },
    onCloseFiltro: function(){
        this._oDialog2.destroy();
    },
    //Función para completar los campos en 0
	onCompleteFormat: function(txt, cant){
		var rtn = "";
		var cycles = cant - txt.length;
		if(txt != ""){
			for(var i = 0; i < cycles; i++){
				rtn += "0";
			}  
		}else{
			return txt;
		}

		return rtn + txt;
	},
    //Función para ir a la vista Principal
    onNavBack: function () {
      window.history.back();
    },
    onBeforeExport: function(oEvt) {
            var mExcelSettings = oEvt.getParameter("exportSettings");
            // GW export
            if (mExcelSettings.url) {
                return;
            }
            // For UI5 Client Export --> The settings contains sap.ui.export.SpreadSheet relevant settings that be used to modify the output of excel

            // Disable Worker as Mockserver is used in explored --> Do not use this for real applications!
            mExcelSettings.workbook.columns[11].type = "date";
			mExcelSettings.worker = false;
            
            //Modificar formato de las columnas
           
        }
  });
});