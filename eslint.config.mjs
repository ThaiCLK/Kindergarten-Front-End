import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';

export default [
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: pluginReact,
    },
    extends: [
      pluginJs.configs.recommended,
      pluginReact.configs.flat.recommended,
      'plugin:prettier/recommended',
    ],
    rules: {
      // Yêu cầu mã nguồn phải tuân thủ các quy tắc định dạng của Prettier. Nếu không, báo lỗi.
      'prettier/prettier': 'error',
    
      // Tắt việc kiểm tra PropTypes của React. Có thể hữu ích nếu bạn sử dụng TypeScript hoặc không dùng PropTypes.
      'react/prop-types': 'off',
    
      // Tắt yêu cầu phải có React trong phạm vi khi sử dụng JSX. Không cần import React trong các phiên bản React mới.
      'react/react-in-jsx-scope': 'off',
    
      // Cảnh báo về các biến không được sử dụng trong mã nguồn. Giúp giữ mã sạch sẽ.
      'no-unused-vars': 'warn',
    
      // Cảnh báo khi có các lệnh console.log trong mã nguồn. Giúp tránh các lệnh debug không mong muốn.
      'no-console': 'warn',
    
      // Yêu cầu sử dụng toán tử so sánh chặt chẽ (=== và !==) thay vì toán tử so sánh lỏng lẻo (== và !=).
      'eqeqeq': 'error',
    
      // Cấm sử dụng khoảng trắng thừa ở cuối dòng. Giúp mã nguồn gọn gàng hơn.
      'no-trailing-spaces': 'error',
    
      // Thêm các quy tắc khác nếu cần
    },
  },
];
