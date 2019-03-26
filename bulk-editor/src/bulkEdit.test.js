import bulkEdit from './bulkEdit';
import flushPromises from './test/support/flushPromises'

const mockUpdate = jest.fn(() => null);

const pluginMock = (options = {}) => {
  const singleton = 'singleton' in options ? options.singleton : false

  return {
    parameters: {
      global: {
        api_key: "ciao"
      }
    },
    startAutoResizer: jest.fn(() => null),
    getFieldValue: jest.fn(() => 'value'),
    itemType: {
      attributes: {
        singleton
      }
    },
    field: {
      attributes: {
        api_key: 'title',
        validators: {
          unique: false
        }
      }
    }
  }
}

const fakeWindow = {
  confirm: jest.fn(() => true),
  alert: jest.fn(() => true)
};

jest.mock('datocms-client', () => ({
  __esModule: true,
  SiteClient: class SiteClient {
    constructor() {
    this.items = {
      all: jest.fn(() => Promise.resolve([
        {
          id: "12",
        }
      ])),
      update: mockUpdate
    };
    }
  }
}))

it('updates fields', async () => {
  const plugin = pluginMock()

  bulkEdit(plugin, document, fakeWindow);
  const button = document.getElementById('DatoCMS-button--primary');
  button.click();

  await flushPromises()
  expect(mockUpdate.mock.calls.length).toBe(1);
});

it('fails for singletons', () => {
  const plugin = pluginMock({singleton: true})

  expect(() => bulkEdit(plugin, document, fakeWindow)).
    toThrow(/model is singleton/)
})
