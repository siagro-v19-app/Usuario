sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel"
], function(Controller, History, MessageBox, JSONModel) {
	"use strict";

	return Controller.extend("br.com.idxtecUsuario.controller.GravarUsuario", {
		onInit: function(){
			var oRouter = this.getOwnerComponent().getRouter();
			
			oRouter.getRoute("gravarusuario").attachMatched(this._routerMatch, this);
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			
			this._operacao = null;
			this._sPath = null;
			
			var oJSONModel = new JSONModel();
			this.getOwnerComponent().setModel(oJSONModel, "model");
		},
		
		_routerMatch: function(){
			var oParam = this.getOwnerComponent().getModel("parametros").getData();
			var oJSONModel = this.getOwnerComponent().getModel("model");
			var oModel = this.getOwnerComponent().getModel();
			var oViewModel = this.getOwnerComponent().getModel("view");
		
			this._operacao = oParam.operacao;
			this._sPath = oParam.sPath;
			
			if (this._operacao === "incluir"){
				
				oViewModel.setData({
					titulo: "Inserir Novo Produto"
				});
			
				var oNovoUsuario = {
					"Id": 0,
					"NomeCompleto": "",
					"Username": "",
					"Senha": ""
				};
				
				oJSONModel.setData(oNovoUsuario);
				
			} else if (this._operacao === "editar"){
				
				oViewModel.setData({
					titulo: "Editar Usuário"
				});
				
				oModel.read(oParam.sPath,{
					success: function(oData) {
						oJSONModel.setData(oData);
					},
					error: function(oError) {
						MessageBox.error(oError.responseText);
					}
				});
			}
		},
		
		onSalvar: function(){
			if (this._checarCampos(this.getView())) {
				MessageBox.information("Preencha todos os campos obrigatórios!");
				return;
			}
			
			if (this._operacao === "incluir") {
				this._createUsuario();
			} else if (this._operacao === "editar") {
				this._updateUsuario();
			}
		},
		
		_goBack: function(){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			
			if (sPreviousHash !== undefined) {
					window.history.go(-1);
				} else {
					oRouter.navTo("usuario", {}, true);
				}
		},
		
		_createUsuario: function() {
			var oModel = this.getOwnerComponent().getModel();
			var oJSONModel = this.getOwnerComponent().getModel("model");
			var that = this;
			
			var oDados = oJSONModel.getData();

			oModel.create("/Usuarios", oDados, {
				success: function() {
					MessageBox.success("Usuário inserido com sucesso!", {
						onClose: function(){
							that._goBack(); 
						}
					});
				},
				error: function(oError) {
					MessageBox.error(oError.responseText);
				}
			});
		},
		
		_updateUsuario: function() {
			var oModel = this.getOwnerComponent().getModel();
			var oJSONModel = this.getOwnerComponent().getModel("model");
			var that = this;
			
			var oDados = oJSONModel.getData();
			
			oModel.update(this._sPath, oDados, {
					success: function() {
					MessageBox.success("Usuário alterado com sucesso!", {
						onClose: function(){
							that._goBack();
						}
					});
				},
				error: function(oError) {
					MessageBox.error(oError.responseText);
				}
			});
		},
		
		_checarCampos: function(oView){
			if(oView.byId("nomecompleto").getValue() === "" || oView.byId("username").getValue() === ""
			|| oView.byId("senha").getValue() === ""){
				return true;
			} else{
				return false; 
			}
		},
		
		onVoltar: function(){
			this._goBack(); 
		}
	});

});