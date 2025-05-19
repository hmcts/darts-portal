import { SecurityGroup } from '@admin-types/index';
import { groupNameExistsValidator } from './group-name.validator';
import { FormControl } from '@angular/forms';

const groups: SecurityGroup[] = ['Group A', 'Group B', 'another group'].map((name, id) => ({
  id,
  name,
  displayName: name,
  description: '',
  displayState: true,
  securityRoleId: 1,
  courthouseIds: [],
  userIds: [],
  globalAccess: false,
}));

describe('#groupNameExistsValidator', () => {
  it('does not validate if no groups are found', () => {
    const validator = groupNameExistsValidator([], '');
    expect(validator({ value: 'Group A' } as unknown as FormControl)).toBeNull();
  });

  it('does not validate if control value is null', () => {
    const validator = groupNameExistsValidator([], '');
    expect(validator({ value: null } as unknown as FormControl)).toBeNull();
  });

  it('does not validate if control value is empty string', () => {
    const validator = groupNameExistsValidator([], '');
    expect(validator({ value: '' } as unknown as FormControl)).toBeNull();
  });

  describe('when creating a group', () => {
    const validator = groupNameExistsValidator(groups, '');

    it('disallows group name with exact match to existing groups', () => {
      expect(validator({ value: 'Group A' } as unknown as FormControl)).toEqual({ groupNameExists: true });
    });

    it('disallows group name with case insensitive match to existing groups', () => {
      expect(validator({ value: 'group a' } as unknown as FormControl)).toEqual({ groupNameExists: true });
    });

    it('disallows group name with leading/trailing whitespace match to existing groups', () => {
      expect(validator({ value: ' Group A ' } as unknown as FormControl)).toEqual({ groupNameExists: true });
    });

    it('allows new group names', () => {
      expect(validator({ value: 'Group C' } as unknown as FormControl)).toBeNull();
    });
  });

  describe('when editing a group', () => {
    const validator = groupNameExistsValidator(groups, 'another group');

    it('allows existing name to be used', () => {
      expect(validator({ value: 'another group' } as unknown as FormControl)).toBeNull();
    });

    it('allows existing name to be used regardless of case', () => {
      expect(validator({ value: 'Another group' } as unknown as FormControl)).toBeNull();
    });

    it('allows new group names', () => {
      expect(validator({ value: 'Group C' } as unknown as FormControl)).toBeNull();
    });

    it('allows existing name to be used regardless of whitespace', () => {
      expect(validator({ value: ' Another group ' } as unknown as FormControl)).toBeNull();
    });

    it('disallows group name with exact match to existing groups', () => {
      expect(validator({ value: 'Group A' } as unknown as FormControl)).toEqual({ groupNameExists: true });
    });

    it('disallows group name with case insensitive match to existing groups', () => {
      expect(validator({ value: 'group a' } as unknown as FormControl)).toEqual({ groupNameExists: true });
    });

    it('disallows group name with leading/trailing whitespace match to existing groups', () => {
      expect(validator({ value: ' Group A ' } as unknown as FormControl)).toEqual({ groupNameExists: true });
    });
  });
});
