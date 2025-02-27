import {SiteClient} from 'datocms-client'

const toggleField = (roleName, plugin) => {
  const {roles} = plugin.parameters.instance
  const hideFromRoles = roles.split(',').map(r => r.toLowerCase())

  if (!hideFromRoles.includes(roleName.toLowerCase())) {
    return
  }

  let path

  if (plugin.field.attributes.localized) {
    path = `${plugin.fieldPath}.${plugin.locale}`
  } else {
    path = plugin.fieldPath
  }
  plugin.toggleField(path, false)
}

const hideFieldFromRole = (plugin, window) => {
  plugin.startAutoResizer()
  const dato = new SiteClient(plugin.parameters.global.apiToken)
  dato.roles.find(plugin.currentUser.relationships.role.data.id)
    .then(role => toggleField(role.name, plugin))
    .catch(error => window.alert(error))
}

export default hideFieldFromRole
