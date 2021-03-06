sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(Controller, MessageBox, JSONModel, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("br.com.idxtecUsuario.controller.Usuario", {
		onInit: function(){
			var oParamModel = new JSONModel();
			
			this.getOwnerComponent().setModel(oParamModel, "parametros"); 
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		},
		
		filtraUsuario: function(oEvent){
			var sQuery = oEvent.getParameter("query");
			var oFilter = new Filter("NomeCompleto", FilterOperator.Contains, sQuery);
			
			var aFilters = [
				oFilter
			];

			this.getView().byId("tableUsuario").getBinding("rows").filter(aFilters, "Application");
		},
		
		onRefresh: function(e){
			var oModel = this.getOwnerComponent().getModel();
			oModel.refresh(true);
			this.getView().byId("tableUsuario").clearSelection();
		},
		
		onIncluir: function(){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var oTable = this.byId("tableUsuario"); 
			
			var oParModel = this.getOwnerComponent().getModel("parametros");
			oParModel.setData({operacao: "incluir"});
			
			oRouter.navTo("gravarusuario");
			oTable.clearSelection();
		},
		
		onEditar: function(){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var oTable = this.byId("tableUsuario");
			var nIndex = oTable.getSelectedIndex();
			
			if (nIndex === -1){
				MessageBox.warning("Selecione um usuário da tabela.");
				return;
			}
			
			var sPath = oTable.getContextByIndex(nIndex).sPath;
			var oParModel = this.getOwnerComponent().getModel("parametros");
			oParModel.setData({sPath: sPath, operacao: "editar"});
			
			oRouter.navTo("gravarusuario");
			oTable.clearSelection();
		},
		
		onRemover: function(e){
			var that = this;
			var oTable = this.byId("tableUsuario");
			var nIndex = oTable.getSelectedIndex();
			
			if (nIndex === -1){
				MessageBox.warning("Selecione um usuário na tabela.");
				return;
			}
			
			MessageBox.confirm("Deseja remover este usuário?", {
				onClose: function(sResposta){
					if(sResposta === "OK"){
						that._remover(oTable, nIndex);
						MessageBox.success("Usuário removido com sucesso!");
					}
				}
			});
		},
		
		_remover: function(oTable, nIndex){
			var oModel = this.getOwnerComponent().getModel();
			var oContext = oTable.getContextByIndex(nIndex);
			
			oModel.remove(oContext.sPath, {
				success: function(){
					oModel.refresh(true);
					oTable.clearSelection();
				}
			});
		}
	});
});