import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Connection } from 'typeorm';

// Create a mock for the Connection object
const mockConnection = {
  query: jest.fn().mockResolvedValue([{ version: 'Mock Version' }])
};

// Create a mock for the AppService
const mockAppService = {
  getHello: jest.fn().mockImplementation(async () => {
    const response = await mockConnection.query('SELECT version()');
    return `Hello World! PG Version: ${response[0].version}`;
  })
};

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: AppService, useValue: mockAppService },  // Use the mock service
        { provide: Connection, useValue: mockConnection }   // Use the mock connection
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World! PG Version: ..." with any PG Version', async () => {
      const result = await appController.getHello();
      console.log(result);  // Log the result to the console
      expect(result).toMatch(/^Hello World! PG Version: .*/);
    });
  });
});
