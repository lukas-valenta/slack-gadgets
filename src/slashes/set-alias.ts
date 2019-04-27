const types = ['button', 'motion-sensor', 'hardwario'];
export const setAlias = async (text: string): Promise<string> => {
  const split = text.split(' ');
  
  if (split.length !== 3) {
    return 'Usage: /set-gadget-alias [type] [id] [alias]';
  }

  const [type, id] = split;

  if (!types.includes(type)) {
    return `Type must be one of: ${types.join(', ')}`;
  }

  if (!id.match(/\d+/)) {
    return 'Id must be a number';
  }

  return 'Okey-dokey';
}
