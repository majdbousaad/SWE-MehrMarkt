
package com.mehrmarkt.mehrmarktsystem.Configuration;



import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;

import javax.sql.DataSource;
import java.util.Properties;


@Configuration
@EnableBatchProcessing
public class ApplicationConfiguration {
	
	
	/*
	 * Job
	 * */
	@Autowired
	public JobBuilderFactory jobBuilderFactory;
	@Autowired
	public StepBuilderFactory stepBuilderFactory;
	
	/*
	 * datasource
	 * */
	@Autowired
	public DataSource dataSource;
	/*
	@Bean(name = "entityManagerFactory")
	public LocalContainerEntityManagerFactoryBean emf() {
		LocalContainerEntityManagerFactoryBean emf = new LocalContainerEntityManagerFactoryBean();


		emf.setDataSource(dataSource);
		emf.setPackagesToScan("com.mehrmarkt.mehrmarktsystem");
		emf.setJpaVendorAdapter(
				new HibernateJpaVendorAdapter());
		emf.setJpaProperties(additionalProperties());
		return emf;
	}


    Properties additionalProperties() {
        Properties properties = new Properties();
        properties.setProperty("hibernate.hbm2ddl.auto", "create-drop");
        properties.setProperty(
          "hibernate.dialect", "org.hibernate.dialect.MySQL57Dialect");
        properties.setProperty("hibernate.show_sql", "true");
         
        return properties;
    }
	
	*/
}


